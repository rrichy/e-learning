<?php

namespace App\Http\Controllers\AdminCorporate;

use App\Http\Controllers\Controller;
use App\Http\Requests\MailTemplatePriorityUpdateRequest;
use App\Http\Requests\MailTemplateStoreUpdateRequest;
use App\Models\MailTemplate;
use App\Services\MailTemplateService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class MailTemplateController extends Controller
{
    public function index(Request $request, MailTemplateService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        $valid = $request->validate([
            'order' => 'string|in:asc,desc',
            'per_page' => 'numeric',
            'sort' => 'string|in:id,title,content,priority,signature_id'
        ]);

        try {
            $list = $service->index($valid, auth()->user()->affiliation_id);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return $list;
    }

    public function store(MailTemplateStoreUpdateRequest $request, MailTemplateService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);

        try {
            $service->store($request->validated());
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully created a mail template!',
        ]);
    }

    public function show(MailTemplate $mail_template, MailTemplateService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);
        Gate::authorize('view-mailtemplate', $mail_template);

        try {
            $details = $service->show($mail_template);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return $details;
    }

    public function update(MailTemplateStoreUpdateRequest $request, MailTemplate $mail_template, MailTemplateService $service)
    {
        Gate::authorize('check-membership', [['admin', 'corporate']]);
        Gate::authorize('update-mailtemplate', $mail_template);

        try {
            $service->update($request->validated(), $mail_template);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully updated a mail template!',
        ]);
    }

    public function massDelete(string $ids, MailTemplateService $service)
    {
        $collection_ids = collect($ids);
        Gate::authorize('check-membership', [['admin', 'corporate']]);
        Gate::authorize('delete-mailtemplate', $collection_ids);

        try {
            $deleted_count = $service->deleteIds($collection_ids);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully deleted ' . $deleted_count . ' templates!',
        ]);
    }

    public function massUpdate(MailTemplatePriorityUpdateRequest $request, MailTemplateService $service)
    {
        $valid = $request->validated();
        $mail_ids = collect(array_map(fn ($mail) => $mail['id'], $valid['payload']));

        Gate::authorize('check-membership', [['admin', 'corporate']]);
        Gate::authorize('mass-update-mailtemplate', $mail_ids);

        try {
            $count = $service->updatePriorities($valid);
        } catch (Exception $ex) {
            abort(500, $ex->getMessage());
        }

        return response()->json([
            'message' => 'Successfully updated ' . $count . ' mail templates!',
        ]);
    }
}
