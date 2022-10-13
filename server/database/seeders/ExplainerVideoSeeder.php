<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\ExplainerVideo;
use Illuminate\Database\Seeder;

class ExplainerVideoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $chapters = Chapter::all();

        $xvideos = [];
        $chapters->each(function ($chapter, $index) use (&$xvideos) {
            $xvideos_count = rand(1, 2);
            $content = '{"blocks":[{"key":"c9cr2","text":"Some random text with styles","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":5,"style":"UNDERLINE"},{"offset":5,"length":7,"style":"STRIKETHROUGH"},{"offset":12,"length":5,"style":"HIGHLIGHT"},{"offset":17,"length":5,"style":"ITALIC"},{"offset":22,"length":6,"style":"BOLD"}],"entityRanges":[],"data":{}}],"entityMap":{}}';
            for ($item_number = 1; $item_number <= $xvideos_count; $item_number++) {
                $xvideos[] = [
                    'chapter_id' => $chapter->id,
                    'item_number' => $item_number,
                    'title' => fake()->text(5),
                    'content' => $content,
                    'video_file_path' => 'https://techhub-v2-bucket.s3.ap-northeast-1.amazonaws.com/sample-video.mp4',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        });

        ExplainerVideo::insert($xvideos);
    }
}
