<?php

require "top.php";

error_reporting(E_ALL);
ini_set('display_errors',1);
$goods = [
	[ "name" => "Book",
	  "price" => 1,
	  "img" => "coke_book.jpg"],

	[ "name" => "Celebrium Collectible",
	  "price" => 1,
	  "img" => "doug-e-fresh.jpg"],

	[ "name" => "Game Pass",
	  "price" => 1,
	  "img" => "coke_pass.jpg"]

];

?>

<div id="main">
<div id="header">
	<div class="ct">
		<div id="logo">
			<img src="static/coke_logo.png" id="ilogo">
		</div>
		<div id="menu">
			<a href="https://cloudcoinconsortium.org">ABOUT</a>
		</div>

	</div>
</div>

<div class="content">
	<div class="ct">
		<div class="r">
			<h1>CocaCola Sample Store</h1>
		<table>
		<?php
			foreach ($goods as $idx => $item) {
		?>
			<tr><td class="title"><b><?=$item['name']?></b><br><?=$item['price']?> Coin Each</td>
			<td class="img"><img src="static/<?=$item['img']?>"></td>
			<td class="input"><input type="text" value="0" name="g<?=$idx?>" data-price="<?=$item['price']?>"></td></tr>
		<?php

			}
		?>

		</table>
		<div class="h">
			<h1>Total Coins Due: <span id="tc">0</span></h1>


			<div>
			<div> <span id="error" class="error"></span> </div>

			<input type="hidden" value="sean225.skywallet.cc" id="skywallet_address"></div>
			<input type="hidden" value="0" id="memo"></div>

			<div id="droparea" ondragover="return false">
				 <span id="hidden_total">Please Drop Coin(s) Here</span>
			</div>

			<input type="file" id="ddfiles" multiple>
			<input type="hidden" id="skywallet" name="sean225.skywallet.cc">
			<div id="result">
				No coins
			</div>
			<button id="send">Click Here Once You Drop Your Coins</button>


			</div>

		</div>


		</div>


	</div>
</div>

<div id="footer">
	<div class="ct">
		<a href="https://coca-cola.com">CocaCola &copy; 2020</a>
		
	</div>
</div>

</div>


<div id="myModal" class="modal">
	<div class="modal-content">
		<span class="close">&times;</span>
		<div id="status">
			<div>Sending coins to the RAIDA</div>
			<div id="statustext">Please wait...</div>
			<div id="progressbar">
				<div id="progress" >&nbsp;</div>
			</div>
		</div>
	</div>

</div>

<?php


require "bottom.php";

