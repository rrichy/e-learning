<?php

namespace App\Jobs;

use App\Models\TemporaryUrl;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessExpiredTemporaryUrl implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $temp_url_id;
    
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(TemporaryUrl $temp_url)
    {
        $this->temp_url_id = $temp_url->id;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $temp_url = TemporaryUrl::where('id', $this->temp_url_id)->first();

        if($temp_url !== null) {
            $temp_url->delete();
        }
    }
}
