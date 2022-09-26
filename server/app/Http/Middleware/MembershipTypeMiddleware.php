<?php

namespace App\Http\Middleware;

use App\Models\MembershipType;
use Closure;
use Illuminate\Http\Request;

class MembershipTypeMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, ...$allowed_membership_types)
    {
        $membership_types = [
            'trial' => MembershipType::TRIAL,
            'individual' => MembershipType::INDIVIDUAL,
            'corporate' => MembershipType::CORPORATE,
            'admin' => MembershipType::ADMIN,
        ];

        $allowed_mt_ids = array_map(function ($mt) use ($membership_types) {
            return $membership_types[$mt];
        }, $allowed_membership_types);
        
        abort_if(!in_array(auth()->user()->membership_type_id, $allowed_mt_ids), 403);

        return $next($request);
    }
}
