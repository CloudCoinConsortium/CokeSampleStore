function showError(error) {
	$("#error").html("Error: " + error)
        $('#error').parent().show()
}
function hideError() {
        $('#error').parent().hide()

}

$(document).ready(() => {
	let raidaJS = new RaidaJS()

        $('#progressbar').hide()
        $('#droparea').click(function(e) {
                e.stopPropagation()
                $('#ddfiles').click()
        })

        $('#ddfiles').change(function() {
                $.each(this.files, processFile)
        })

        if (typeof($.event.props) !== 'undefined')
                $.event.props.push('dataTransfer')

        var fileArray = []


        $('#droparea').bind('dragenter', function() {
                $(this).css({'box-shadow' : 'inset 0px 0px 20px rgba(0, 0, 0, 0.1)', 'border' : '2px dashed rgba(0,0,0,0.5)'});
                return false;
        });
        $('#droparea').bind('dragleave', function() {
                $(this).css({'box-shadow' : 'none', 'border' : '2px dashed rgba(0,0,0,0.2)'});
                return false;
        });

        $('#droparea').bind('drop', function() {
                $(this).css({'box-shadow' : 'none', 'border' : '2px dashed rgba(0,0,0,0.2)'});
                return false;
        });

        $('#droparea').bind('drop', function(e) {
		var files = e.dataTransfer.files
		$.each(files, processFile)
        })

	let goods = {}
	function calcDue() {
		let due = 0
		for (let i in goods) {
			due += goods[i].val * goods[i].price
		}

		$("#tc").html(due)
		
		return due
	}

	$("input[type='text']").each(function() {
		let name = $(this).attr('name')
		goods[name] = {
			'val' : $(this).val(),
			'price' : $(this).attr('data-price')
		}
	})

	$("input[type='text']").change(function() {
		let v = $(this).each(function() {
			let name = $(this).attr('name')
			goods[name] = {
				'val' : $(this).val(),
				'price' : $(this).attr('data-price')
			}
		})

		showTotal()
	})

	$(".close").click(e => {
		$("#myModal").hide()
	})

	$("#send").click(e => {
		let due = calcDue()
		if (due == 0) {
			showError("No items chosen")
			return
		}
		let rest = showTotal()
		if (rest > 0) {
			showError("Not enough coins")
			return
		}

		$("#myModal").show()

		let skywallet = $("#skywallet").attr("name")
		let memo = 'From Coke Online Store'
		let args = {
			'to' : skywallet,
			'memo' : memo,
			'coins' : []
		}

		let total = 0
		for (let i = 0; i < fileArray.length; i++) {
			let coins = fileArray[i]['result']
                        for (let cc of coins) {
				args.coins.push({
					sn: cc.sn,
					nn: cc.nn,
					an: cc.an
				})

				total += raidaJS.getDenomination(cc.sn)
			}
		}

	        $('#progressbar').show()
		let raidaOk = 0
		raidaJS.apiSend(args, raidaNumber => {
			raidaOk++
			let pct = Math.round((raidaOk / 25.0) * 100);
			$('#progress').css({'width' : pct + '%'})
		}).then(results => {
			$("#myModal").hide()
			if (results.status != 'done') {
				 showError("Invalid status from Raida: " + results.status)
				 return
			}

			if (results.totalNotes != (results.authenticNotes + results.frackedNotes)) {
				let text = "Counterfeit! Total Notes: " + results.totalNotes + ", Counterfeit Notes: " + (results.counterfeitNotes + results.errorNotes)
				showError(text)
				return
			}

			let get = "?invoice=[memo]&from=[to]&total_coins_sent=[total]&book_88719=[book]&art_99882=[art]&product_998823=[product]" ;
			get = get.replace("[memo]", memo);
			get = get.replace("[to]", skywallet);
			get = get.replace("[total]", total);
			get = get.replace("[book]", goods['g0'].val);
			get = get.replace("[art]", goods['g1'].val);
			get = get.replace("[product]", goods['g2'].val);
			window.location.replace("https://pownesium.com/sample_store/coke_payment_verifier.php" + get);
		})

		console.log(args)



	})

        function showTotal() {
                var sum = 0

		for (var i = 0; i < fileArray.length; i++) {
			var coins = fileArray[i]['result']
                        for (var cc in coins) {
                                var coin = coins[cc]
                                var d = raidaJS.getDenomination(coin['sn'])

                                sum += d
                        }
                }

                var cstr = sum + " CloudCoins"
                if (sum == 0)
                        cstr = ""

		let due = calcDue()
		let rest = due - sum
		if (rest < 0) {
			rest = 0
	                $('#hidden_total').html("Done!")
		} else
	                $('#hidden_total').html("Please Drop " + rest + " Coin(s) Here")

		return rest
        }


        function addCoinToList() {
                var table = $('<table>')
                $('#result').html('')
                for (var i = 0; i < fileArray.length; i++) {
			var tr = $('<tr>')
			var coinsCnt =  fileArray[i]['result'].length

			tr.append('<td>' + coinsCnt + ' coins</td><td>' + fileArray[i]['name'] + '</td><td style="width:30px"><a href="javascript:void(0)" data-id="' + i + '" class="delete">Delete</a></td>')
                //      var data = "<tr>" + fileArray[i]['name'] + "</p>"
                        table.append(tr)
                }
                $('#result').append(table)

                $('.delete').unbind('click')
                $('.delete').bind('click', function() {
                        var idx = $(this).attr('data-id')

                        fileArray.splice(idx, 1)
                        addCoinToList()
			showTotal()
                        return false
                })

                showTotal()
        }


	function processFile(index, file) {
		var filetype = file['type'],
			filename = file['name']

		var fformat = "json"
		if (filetype) {
			if (filetype.match('^text/.*') || filetype == "application/x-wine-extension-stack" || filetype == "application/json") {
				fformat = "json"
                        } else {
				showError("Only JSON files are supported")
                                return
                        }
                }

		hideError()
		var fileReader = new FileReader()
		fileReader.onload = (function(file) {
			return function(e) {
				try {
					var data = JSON.parse(this.result)
					coins = data['cloudcoin']
					if (typeof(coins) === 'undefined') {
						showError("Invalid JSON format for " + filename)
						return
					}
				} catch (error) {
					showError("Invalid JSON format for " + filename)
					return
				}

				fileArray.push({'name' : filename, 'result' : coins })
				addCoinToList()
                        }
		})(file)

		fileReader.readAsText(file)
	}


})
