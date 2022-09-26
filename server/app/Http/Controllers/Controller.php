<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    // Appends a single attribute to each item of an array
    public static function appendAttribute(array $arr, string $att, mixed $val)
    {
        return array_map(function ($item) use ($att, $val) {
            $item[$att] = $val;
            return $item;
        }, $arr);
    }
}
