<?php $path = "/CRISPR-Cereal/";$cgi_path = "/cgi-bin/CRISPR-Cereal/";$background_color="f7f6f2";$header_color="#eae5e3";

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta name = "viewport" content = "width = device-width, initial-scale = 1.0">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>CRISPR-Cereal</title>
    <link rel="stylesheet" type="text/css" href="<?php echo $path;?>/js/cereal/bootstrap-3.3.7-dist/css/bootstrap.min.css">
	<script src="<?php echo $path;?>/js/cereal/jquery-2.1.1/jquery.min.js"></script>
    <script src="<?php echo $path;?>/js/cereal/citrus.base.js"></script>
	<script src="<?php echo $path;?>/js/cereal/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>
    <script src="<?php echo $path;?>/js/cereal/table/bootstrap-table.min.js"></script>

    <link href="favicon.ico" type="image/x-icon" rel="shortcut icon" />
    <link type="text/css" rel="stylesheet" href="<?php echo $path?>css/cereal/citrus.base.css">
</head>
	
	
<body>
<div id="nav">
    <nav class="navbar navbar-default navbar-static-top" style="width=90vw;">
        <div class="container" style="width:90vw;padding:5px 20px;">
            <div class="col-md-12"><span style="color: rgb(119, 119, 119);font-weight:bold;font-size:1.2vw;"><img src="<?php echo $path?>images/cereal.png" height="60px" display="inline-block"></span></div>
            <div class="col-md-12" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav ">
                    <li ><a href="<?php echo $path;?>index.php"></span> Home <span class="sr-only">(current)</span></a></li>
                    <li ><a href="<?php echo $cgi_path;?>main"></span> Submit</a></li>
                    <li><a href="<?php echo $path;?>help.php"> Help </a></li>
                    <li><a href="<?php echo $path;?>contact_us.php"> Contact Us </a></li>
                </ul>
            </div>
        </div> 
    </nav>
</div> 