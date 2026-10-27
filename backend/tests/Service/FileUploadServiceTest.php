<?php

declare(strict_types=1);

namespace App\Tests\Service;

use App\Service\FileUploadService;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

final class FileUploadServiceTest extends TestCase
{
    private string $tempDir;
    private FileUploadService $service;

    protected function setUp(): void
    {
        $this->tempDir = sys_get_temp_dir().'/triago_upload_test_'.bin2hex(random_bytes(4));
        mkdir($this->tempDir.'/public/uploads/avatars', 0777, true);
        $this->service = new FileUploadService($this->tempDir);
    }

    protected function tearDown(): void
    {
        $this->removeDirectory($this->tempDir);
    }

    public function testSaveBase64ImageValidPng(): void
    {
        // 1x1 transparent PNG
        $base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        $url = $this->service->saveBase64Image($base64, 'avatars');

        self::assertNotNull($url);
        self::assertStringStartsWith('/uploads/avatars/avatars_', $url);
        self::assertStringEndsWith('.png', $url);
        self::assertFileExists($this->tempDir.'/public'.$url);

        // Clean up
        $this->service->deleteFile($url);
        self::assertFileDoesNotExist($this->tempDir.'/public'.$url);
    }

    public function testSaveBase64ImageInvalidData(): void
    {
        $url = $this->service->saveBase64Image('not-a-valid-data-uri', 'avatars');
        self::assertNull($url);
    }

    public function testSaveUploadedFileValid(): void
    {
        $tmpFile = tempnam(sys_get_temp_dir(), 'test_img');
        file_put_contents($tmpFile, 'fake-jpeg-content');

        $uploadedFile = new UploadedFile(
            $tmpFile,
            'photo.jpg',
            'image/jpeg',
            null,
            true,
        );

        $url = $this->service->saveUploadedFile($uploadedFile, 'avatars');

        self::assertStringStartsWith('/uploads/avatars/avatars_', $url);
        self::assertStringEndsWith('.jpg', $url);
        self::assertFileExists($this->tempDir.'/public'.$url);

        $this->service->deleteFile($url);
        self::assertFileDoesNotExist($this->tempDir.'/public'.$url);
    }

    public function testSaveUploadedFileInvalidType(): void
    {
        $tmpFile = tempnam(sys_get_temp_dir(), 'test_exe');
        file_put_contents($tmpFile, 'malicious');

        $uploadedFile = new UploadedFile(
            $tmpFile,
            'script.exe',
            'application/x-msdownload',
            null,
            true,
        );

        $this->expectException(BadRequestHttpException::class);
        $this->service->saveUploadedFile($uploadedFile, 'avatars');
    }

    private function removeDirectory(string $dir): void
    {
        if (!is_dir($dir)) {
            return;
        }

        $files = array_diff(scandir($dir) ?: [], ['.', '..']);
        foreach ($files as $file) {
            $path = "$dir/$file";
            is_dir($path) ? $this->removeDirectory($path) : unlink($path);
        }
        rmdir($dir);
    }
}
