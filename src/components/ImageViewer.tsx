import React, { useState } from 'react';

const ImageViewer = ({ imageUrl }) => {
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Thumbnail of the image */}
      <img
        alt="Thumbnail"
        style={{
          cursor: 'pointer',
          width: '120px',
          height: '130px',
          objectFit: 'cover',
        }}
        onClick={openModal}
        src={imageUrl || '/place.png'}
        data-toggle="tooltip" data-placement="top" title="Click to view"
      />

      {/* Modal for viewing the image */}
      {isModalOpen && (
        <div
          className="modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={closeModal}
        >
          <div
            className="modal-content"
            style={{
              position: 'relative',
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '90vw'
            }}
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside the modal
          >
            <span
              className="close"
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '24px',
                cursor: 'pointer',
              }}
            >
              &times;
            </span>
            <img
              src={imageUrl || '/place.png'}
              alt="Full Image"
              style={{
                maxWidth: '90%',
                maxHeight: '90vh',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
