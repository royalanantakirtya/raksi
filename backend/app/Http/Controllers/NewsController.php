<?php

namespace App\Http\Controllers;

use App\Services\NewsService;
use Illuminate\Http\JsonResponse;

class NewsController extends Controller
{
    public function __construct(private NewsService $newsService) {}

    public function index(): JsonResponse
    {
        $news = $this->newsService->getAllNews();
        return response()->json(['data' => $news]);
    }
}
