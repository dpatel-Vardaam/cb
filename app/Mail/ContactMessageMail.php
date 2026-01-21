<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessageMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        public string $fromName,
        public string $fromEmail,
        public ?string $phone,
        public string $subjectLine,
        public string $body,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subjectLine,
            replyTo: [
                new \Illuminate\Mail\Mailables\Address($this->fromEmail, $this->fromName),
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact-message',
        );
    }
}
