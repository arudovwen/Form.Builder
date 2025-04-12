import React, { useState, useEffect } from 'react';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'image'];
const ICONS = {
  pdf: '/pdf-icon.png',
  word: '/word-icon.png',
  excel: '/excel-icon.png',
  powerpoint: '/ppt-icon.png',
  other: '/file-icon.png',
};

const getFileType = (url: string = ''): string => {
  const ext = url.split('.').pop()?.toLowerCase() || '';
  if (IMAGE_EXTENSIONS.includes(ext) || url.startsWith('data:image/')) return 'image';
  if (['pdf'].includes(ext) || url.startsWith('data:application/pdf')) return 'pdf';
  if (['doc', 'docx'].includes(ext) || url.startsWith('data:application/msword') || url.startsWith('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document')) return 'word';
  if (['xls', 'xlsx', 'csv'].includes(ext) || url.startsWith('data:application/vnd.ms-excel') || url.startsWith('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) return 'excel';
  if (['ppt', 'pptx'].includes(ext) || url.startsWith('data:application/vnd.ms-powerpoint') || url.startsWith('data:application/vnd.openxmlformats-officedocument.presentationml.presentation')) return 'powerpoint';
  if (['txt'].includes(ext) || url.startsWith('data:text/')) return 'text';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive';
  if (['mp4', 'mkv', 'webm', 'avi', 'mov'].includes(ext) || url.startsWith('data:video/')) return 'video';
  if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(ext) || url.startsWith('data:audio/')) return 'audio';
  return 'other';
};

const UniversalFileViewer = ({ fileUrl, fileName }: { fileUrl?: string; fileName?: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileType, setFileType] = useState('unknown');

  useEffect(() => {
    if (fileUrl) setFileType(getFileType(fileUrl));
  }, [fileUrl]);

  const handleFileClick = () => {
    if (fileType === 'image') {
      setIsModalOpen(true);
    } else {
      window.open(fileUrl, '_blank');
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const renderFilePreview = () => {
    if (fileType === 'image') {
      return (
        <button className="btn btn-view text-sm font-semibold" type="button" aria-label="Preview file">
          <span>Preview File</span>
        </button>
      );
    }

    const icon = ICONS[fileType as keyof typeof ICONS] || ICONS.other;

    return (
      <div
        onClick={handleFileClick}
        className="cursor-pointer border border-gray-200  bg-gray-200 rounded p-2 flex flex-col items-center justify-center hover:shadow"
        title={`Click to ${fileType === 'pdf' ? 'open' : 'download'} ${fileName || 'file'}`}
      >
      {fileType === 'image' &&  <div className="w-14 h-14 flex items-center justify-center mb-2">
          <img src={icon} alt={`${fileType} icon`} className="max-w-full max-h-full" />
        </div>}
        <div className="text-xs text-gray-700 truncate w-full text-center">
          {fileName || fileUrl?.split('/').pop() || 'Unknown file'}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-2">
      <div onClick={handleFileClick}>{renderFilePreview()}</div>

      {isModalOpen && fileType === 'image' && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-white p-5 rounded-lg max-w-[90vw] max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-2xl font-bold text-gray-700"
              aria-label="Close preview"
            >
              &times;
            </button>
            <img
              src={fileUrl || '/place.png'}
              alt={fileName || 'Full Image'}
              className="max-w-full max-h-[80vh] mx-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalFileViewer;
