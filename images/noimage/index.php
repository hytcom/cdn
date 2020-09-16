<?php 

$aFormat = array(640, 480, "F4F4F4");
if(isset($_GET["s"]) && !empty($_GET["s"])) {
    $aCustom = explode("x", $_GET["s"]);
    if(isset($aCustom[0])) { $aFormat[0] = $aCustom[0]; }
    if(isset($aCustom[1])) { $aFormat[1] = $aCustom[1]; }
    if(isset($aCustom[2])) { $aFormat[2] = $aCustom[2]; }
}

$nWidth = $aFormat[0];
$nHeight = $aFormat[1];
$sBgColor = "#".$aFormat[2];
$nTextBoxWidth = ($nWidth*.9);
$nTextBoxHeight = ($nHeight*.9);
$nTop = ($nHeight - $nTextBoxHeight)/2;
$nLeft = ($nWidth - $nTextBoxWidth)/2;
$nFont = $nHeight*.1;
$nFontColor = color_inverse($sBgColor);
$sText = (isset($_GET["t"]) && !empty($_GET["t"])) ? strip_tags($_GET["t"]) : $nWidth."x".$nHeight;


function color_inverse($color){
    $color = str_replace('#', '', $color);
    if (strlen($color) != 6){ return '000000'; }
    $rgb = '';
    for ($x=0;$x<3;$x++){
        $c = 255 - hexdec(substr($color,(2*$x),2));
        $c = ($c < 0) ? 0 : dechex($c);
        $rgb .= (strlen($c) < 2) ? '0'.$c : $c;
    }
    return '#'.$rgb;
}

$SVG = <<<SVG
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" 
    xml:space="preserve" 
    width="{$nWidth}px" 
    height="{$nHeight}px" 
    version="1.1" 
    style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
    viewBox="0 0 {$nWidth} {$nHeight}"
    xmlns:xlink="http://www.w3.org/1999/xlink"
>
    <defs>
        <style type="text/css">
            <![CDATA[
                body { margin: 0; }
                div { display: table; margin: auto; font-size:{$nFont}px; width: {$nTextBoxWidth}px; height: {$nTextBoxHeight}px; }
                p { display: table-cell; text-align: center; vertical-align: middle; color: {$nFontColor}; }
            ]]>
        </style>
    </defs>
	<rect x="0" y="0" width="100%" height="100%" fill="{$sBgColor}"/>
    <foreignObject x="{$nLeft}" y="{$nTop}" width="{$nTextBoxWidth}px" height="{$nTextBoxHeight}px">
        <body xmlns="http://www.w3.org/1999/xhtml">
            <div><p>{$sText}</p></div>
        </body>
    </foreignObject>
</svg>
SVG;

header("Content-type: image/svg+xml");
die($SVG);

?>