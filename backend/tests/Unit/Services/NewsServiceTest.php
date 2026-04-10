<?php

namespace Tests\Unit\Services;

use App\Repositories\NewsRepositoryInterface;
use App\Services\NewsService;
use Illuminate\Database\Eloquent\Collection;
use Mockery;
use Tests\TestCase;

class NewsServiceTest extends TestCase
{
    private $newsRepository;
    private $newsService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->newsRepository = Mockery::mock(NewsRepositoryInterface::class);
        $this->newsService = new NewsService($this->newsRepository);
    }

    public function test_get_all_news(): void
    {
        $expectedNews = new Collection([]);
        $this->newsRepository->shouldReceive('getAll')
            ->once()
            ->andReturn($expectedNews);

        $result = $this->newsService->getAllNews();

        $this->assertEquals($expectedNews, $result);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}
