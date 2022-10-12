<?php

return [
    'prefixes' => [
        's3' => 'https://'.env('AWS_BUCKET').'.s3.'.env('AWS_DEFAULT_REGION').'.amazonaws.com/',
    ]
];