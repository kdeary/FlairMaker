<?php 
if($_POST['getids'] == 'true'){
  $fi = new FilesystemIterator('../preview/', FilesystemIterator::SKIP_DOTS);
  $text = "";
  $fake = iterator_count($fi);
  for($i = 0;$i > $fake; $i++){
    $text .= "hello";
  }
  echo $fake;
} else {
  $img = $_POST['imgBase64'];
  $img = str_replace('data:image/png;base64,', '', $img);
  $img = str_replace(' ', '+', $img);
  $fileData = base64_decode($img);
  $fi = new FilesystemIterator('../preview/', FilesystemIterator::SKIP_DOTS);
  $filename = '../preview/'. iterator_count($fi).'.png';
  $htmlname = '../show/'. iterator_count($fi).'.html';
  $id = iterator_count($fi);
  echo iterator_count($fi);
  file_put_contents($filename, $fileData);
  file_put_contents($htmlname, "
  <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'>
  <body style='overflow-x: hidden;'>
  <h1 class='text-center'>" .$_POST['flname']. "</h1>
  <div class='row' style='margin-top: 8%;'>
  <div class='col-xs-2 thumbnail' style='margin-left: 42%'><img src='http://korbinskode.com/flairmaker/preview/" . $id . ".png' class='center-block'><p class='text-center'><b>".$_POST['flname']."</b></p><p class='text-center'>".$_POST['fltag']."</p></div>
  <a href='/flairmaker/' class='text-center'>Back to Home</a>
  </div>
  </body>
  ");
}
?>