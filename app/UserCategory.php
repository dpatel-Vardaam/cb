<?php

namespace App;

enum UserCategory: string
{
    case ADMIN = 'admin';
    case CONSUMER = 'consumer';
}
