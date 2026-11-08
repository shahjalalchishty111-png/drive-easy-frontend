import Swal from 'sweetalert2';

// Themed yes/no confirmation modal for destructive actions.
// Returns true when the user confirms.
export default async function confirmDialog({
  title = 'Are you sure?',
  text = '',
  confirmText = 'Confirm',
  danger = true,
} = {}) {
  const res = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
      popup: 'de-modal',
      title: 'de-modal-title',
      htmlContainer: 'de-modal-text',
      actions: 'de-modal-actions',
      confirmButton: danger ? 'de-btn de-btn-danger' : 'de-btn de-btn-primary',
      cancelButton: 'de-btn de-btn-cancel',
    },
  });
  return res.isConfirmed;
}
