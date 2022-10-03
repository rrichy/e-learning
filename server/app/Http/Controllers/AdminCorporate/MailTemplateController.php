<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Requests\MailTemplateStoreUpdateRequest;
use App\Models\MailTemplate;
use App\Services\MailTemplateService;
use Illuminate\Http\Request;

class MailTemplateController extends Controller
{
    public function index(MailTemplateService $service)
    {
        return $service->list();
    }
    
    public function store(MailTemplateStoreUpdateRequest $request, MailTemplateService $service)
    {
        $service->store($request);

        return response()->json([
            'message' => 'Successfully created a mail template!',
        ]);
    }
    
    public function update(MailTemplateStoreUpdateRequest $request, MailTemplate $mail_template, MailTemplateService $service)
    {
        $service->update($request, $mail_template);

        return response()->json([
            'message' => 'Successfully updated a mail template!',
        ]);
    }
    
    public function massDelete(string $ids, MailTemplateService $service)
    {
        $deleted_count = $service->deleteIds($ids);

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' templates!',
        ]);
    }
    
    public function massUpdate(Request $request, MailTemplateService $service)
    {
        $count = $service->updatePriorities($request);

        return response()->json([
            'message' => 'Successfully updated ' . $count . ' mail templates!',
        ]);
    }
}
