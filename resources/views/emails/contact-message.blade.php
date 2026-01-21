<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Message</title>
</head>

<body style="margin:0;padding:0;background:#0b0b10;color:#ffffff;font-family:Arial, Helvetica, sans-serif;">
    <div style="max-width:720px;margin:0 auto;padding:32px;">
        <div style="background:#12121a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px;">
            <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;">New contact message</h1>

            <p style="margin:0 0 10px;color:rgba(255,255,255,0.7);">
                <strong style="color:#ffffff;">From:</strong>
                {{ $fromName }} ({{ $fromEmail }})
            </p>

            @if(!empty($phone))
                <p style="margin:0 0 10px;color:rgba(255,255,255,0.7);">
                    <strong style="color:#ffffff;">Phone:</strong>
                    {{ $phone }}
                </p>
            @endif

            <p style="margin:0 0 16px;color:rgba(255,255,255,0.7);">
                <strong style="color:#ffffff;">Subject:</strong>
                {{ $subjectLine }}
            </p>

            <div
                style="padding:16px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);">
                <p style="margin:0;white-space:pre-wrap;color:rgba(255,255,255,0.85);line-height:1.6;">{{ $body }}</p>
            </div>

            <p style="margin:16px 0 0;color:rgba(255,255,255,0.55);font-size:12px;">
                Reply directly to this email to respond.
            </p>
        </div>
    </div>
</body>

</html>