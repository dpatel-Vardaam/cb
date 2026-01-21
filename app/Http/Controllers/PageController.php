<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessageMail;
use App\Settings\ContactSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function about(): Response
    {
        return Inertia::render('about');
    }

    public function contact(ContactSettings $contactSettings): Response
    {
        return Inertia::render('contact', [
            'contact' => [
                'email' => $contactSettings->email,
                'phone' => $contactSettings->phone,
            ],
        ]);
    }

    public function submitContact(Request $request, ContactSettings $contactSettings): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $sent = true;
        try {
            Mail::to($contactSettings->email)->send(new ContactMessageMail(
                fromName: $validated['name'],
                fromEmail: $validated['email'],
                phone: $validated['phone'] ?? null,
                subjectLine: $validated['subject'],
                body: $validated['message'],
            ));
        } catch (\Throwable $e) {
            $sent = false;
            Log::error('Contact form submission failed to send mail.', [
                'exception' => $e->getMessage(),
            ]);
        }

        if (! $sent) {
            return back()->with('error', 'We could not send your message right now. Please try again later.');
        }

        return back()->with('success', 'Thanks! Your message has been sent.');
    }
}
