<?php
$ids = [1,2,3,4,5];
$seed = 1;
mt_srand($seed);
$count = count($ids);
for ($i = $count - 1; $i > 0; $i--) {
    $j = mt_rand(0, $i);
    $temp = $ids[$i];
    $ids[$i] = $ids[$j];
    $ids[$j] = $temp;
}
mt_srand();
echo json_encode($ids);
