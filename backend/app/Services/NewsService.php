<?php

namespace App\Services;

use App\Repositories\NewsRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class NewsService
{
    public function __construct(private NewsRepositoryInterface $newsRepository) {}

    public function getAllNews(): Collection
    {
        return $this->newsRepository->getAll();
    }
}
