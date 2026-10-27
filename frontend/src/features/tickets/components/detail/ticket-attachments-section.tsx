'use client';

import * as React from 'react';
import {
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  Paperclip,
  Plus,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { Button } from '#/components/ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog.tsx';
import { cn } from '#/lib/utils';

export interface AttachmentItem {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'file' | string;
  url?: string;
}

export interface TicketAttachmentsSectionProps {
  attachments: AttachmentItem[];
  onRemoveAttachment: (id: string) => void;
  onAddAttachment?: (file: File) => void;
}

export function TicketAttachmentsSection({
  attachments,
  onRemoveAttachment,
  onAddAttachment,
}: TicketAttachmentsSectionProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<AttachmentItem | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && onAddAttachment) {
      Array.from(files).forEach((file) => onAddAttachment(file));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && onAddAttachment) {
      Array.from(e.dataTransfer.files).forEach((file) => onAddAttachment(file));
    }
  };

  const images = attachments.filter(
    (att) => att.type === 'image' || att.name.match(/\.(png|jpe?g|gif|webp|svg)$/i),
  );
  const otherFiles = attachments.filter(
    (att) => att.type !== 'image' && !att.name.match(/\.(png|jpe?g|gif|webp|svg)$/i),
  );

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip className="size-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Załączniki & Zdjęcia ({attachments.length})
          </h3>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt,.doc,.docx,.zip"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-7 text-xs gap-1.5 cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span>Dodaj plik / zdjęcie</span>
        </Button>
      </div>

      {/* Drag & drop upload area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted hover:border-primary/50 hover:bg-muted/10',
        )}
      >
        <UploadCloud className="size-5 mx-auto text-muted-foreground mb-1" />
        <p className="text-xs text-foreground font-medium">
          Przeciągnij i upuść zdjęcia lub pliki tutaj, albo{' '}
          <span className="text-primary underline">wybierz z dysku</span>
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Obsługuje PNG, JPG, WebP, PDF i logi tekstowe
        </p>
      </div>

      {/* Attachments Content */}
      {attachments.length === 0 ? (
        <p className="text-xs text-muted-foreground italic py-1 text-center">
          Brak załączonych plików w tym zadaniu.
        </p>
      ) : (
        <div className="space-y-4 pt-1">
          {/* Images Grid Preview */}
          {images.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="size-3.5 text-primary" />
                Zdjęcia i zrzuty ekranu ({images.length})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="group relative rounded-lg border bg-muted/20 overflow-hidden hover:border-primary/50 transition-all shadow-xs"
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => setPreviewImage(img)}
                      className="aspect-video w-full bg-muted/40 flex items-center justify-center cursor-pointer relative overflow-hidden"
                    >
                      {img.url ? (
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <ImageIcon className="size-6 mb-1 opacity-50" />
                          <span className="text-[10px]">Obraz</span>
                        </div>
                      )}

                      {/* Overlay action buttons */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                        <Button
                          type="button"
                          size="icon"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(img);
                          }}
                          className="size-7 rounded-full bg-background/90 hover:bg-background cursor-pointer"
                          title="Podgląd zdjęcia"
                        >
                          <Eye className="size-3.5" />
                        </Button>
                        {img.url && (
                          <a
                            href={img.url}
                            download={img.name}
                            onClick={(e) => e.stopPropagation()}
                            className="size-7 rounded-full bg-background/90 hover:bg-background flex items-center justify-center text-foreground cursor-pointer"
                            title="Pobierz zdjęcie"
                          >
                            <Download className="size-3.5" />
                          </a>
                        )}
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveAttachment(img.id);
                          }}
                          className="size-7 rounded-full cursor-pointer"
                          title="Usuń zdjęcie"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Image Footer info */}
                    <div className="p-2 text-xs">
                      <p className="font-medium truncate text-foreground text-[11px]" title={img.name}>
                        {img.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{img.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Files List */}
          {otherFiles.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="size-3.5 text-muted-foreground" />
                Dokumenty i pliki ({otherFiles.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {otherFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="size-7 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <FileText className="size-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-[10px] text-muted-foreground">{file.size}</p>
                    </div>
                    {file.url && (
                      <a
                        href={file.url}
                        download={file.name}
                        className="size-7 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                        title="Pobierz plik"
                      >
                        <Download className="size-3.5" />
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveAttachment(file.id)}
                      className="size-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer shrink-0"
                      title="Usuń plik"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Lightbox Image Preview Modal ─────────────────────────── */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-3xl p-4 bg-background/95 backdrop-blur-md">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-3">
            <div>
              <DialogTitle className="text-sm font-semibold truncate max-w-lg">
                {previewImage?.name}
              </DialogTitle>
              <p className="text-[11px] text-muted-foreground">{previewImage?.size}</p>
            </div>
            {previewImage?.url && (
              <a
                href={previewImage.url}
                download={previewImage.name}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-muted hover:bg-muted/80 text-foreground cursor-pointer mr-6"
              >
                <Download className="size-3.5" />
                <span>Pobierz</span>
              </a>
            )}
          </DialogHeader>

          <div className="flex items-center justify-center min-h-[300px] max-h-[70vh] overflow-hidden rounded-lg bg-black/5 dark:bg-black/20 p-2">
            {previewImage?.url ? (
              <img
                src={previewImage.url}
                alt={previewImage.name}
                className="max-h-[65vh] max-w-full object-contain rounded shadow-md"
              />
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                <ImageIcon className="size-12 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Brak podglądu pliku</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
