<?php

declare(strict_types=1);

namespace App\Service;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

final class FileUploadService
{
    private const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
    ];

    public function __construct(
        #[Autowire('%kernel.project_dir%')]
        private readonly string $projectDir,
    ) {
    }

    /**
     * Saves an uploaded file to public/uploads/{subfolder} and returns relative URL /uploads/{subfolder}/{filename}.
     */
    public function saveUploadedFile(UploadedFile $file, string $subfolder): string
    {
        $ext = strtolower($file->getClientOriginalExtension());
        if ('' === $ext) {
            $ext = 'jpg';
        }

        $mime = $file->getClientMimeType();

        if (!in_array($ext, self::ALLOWED_EXTENSIONS, true) && !in_array($mime, self::ALLOWED_MIME_TYPES, true)) {
            throw new BadRequestHttpException('Nieprawidłowy format pliku. Dozwolone są pliki JPG, PNG, WEBP i GIF.');
        }

        if ($file->getSize() > 5 * 1024 * 1024) {
            throw new BadRequestHttpException('Rozmiar pliku nie może przekraczać 5 MB.');
        }

        $safeExtension = in_array($ext, self::ALLOWED_EXTENSIONS, true) ? $ext : 'jpg';
        $filename = sprintf('%s_%s.%s', $subfolder, bin2hex(random_bytes(10)), $safeExtension);

        $targetDir = sprintf('%s/public/uploads/%s', $this->projectDir, $subfolder);
        if (!is_dir($targetDir) && !mkdir($targetDir, 0775, true) && !is_dir($targetDir)) {
            throw new FileException(sprintf('Nie można utworzyć katalogu zapisu: %s', $targetDir));
        }

        $file->move($targetDir, $filename);

        return sprintf('/uploads/%s/%s', $subfolder, $filename);
    }

    /**
     * Saves a base64 encoded data URI to public/uploads/{subfolder} and returns relative URL /uploads/{subfolder}/{filename}.
     */
    public function saveBase64Image(string $base64, string $subfolder): ?string
    {
        if (!str_starts_with($base64, 'data:image/')) {
            return null;
        }

        if (!preg_match('#^data:image/(?<type>[a-zA-Z0-9\+\-]+);base64,(?<data>.+)$#', $base64, $matches)) {
            return null;
        }

        $type = strtolower($matches['type']);
        if ('jpeg' === $type) {
            $type = 'jpg';
        }

        if (!in_array($type, self::ALLOWED_EXTENSIONS, true)) {
            $type = 'png';
        }

        $binary = base64_decode($matches['data'], true);
        if (false === $binary) {
            return null;
        }

        $filename = sprintf('%s_%s.%s', $subfolder, bin2hex(random_bytes(10)), $type);
        $targetDir = sprintf('%s/public/uploads/%s', $this->projectDir, $subfolder);

        if (!is_dir($targetDir) && !mkdir($targetDir, 0775, true) && !is_dir($targetDir)) {
            throw new FileException(sprintf('Nie można utworzyć katalogu zapisu: %s', $targetDir));
        }

        file_put_contents(sprintf('%s/%s', $targetDir, $filename), $binary);

        return sprintf('/uploads/%s/%s', $subfolder, $filename);
    }

    /**
     * Deletes a file from public/uploads/ if it exists.
     */
    public function deleteFile(?string $relativePath): void
    {
        if (null === $relativePath || !str_starts_with($relativePath, '/uploads/')) {
            return;
        }

        $fullPath = sprintf('%s/public%s', $this->projectDir, $relativePath);
        if (is_file($fullPath)) {
            @unlink($fullPath);
        }
    }
}
