import Swal from 'sweetalert2';

// Professional, non-blocking toast shown top-right. No confirm button; auto-dismisses.
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3200,
  timerProgressBar: true,
  customClass: { popup: 'de-toast' },
  didOpen: (el) => {
    el.addEventListener('mouseenter', Swal.stopTimer);
    el.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const fire = (icon, title, text) => Toast.fire({ icon, title, text });

const toast = {
  success: (title, text) => fire('success', title, text),
  error: (title, text) => fire('error', title, text),
  info: (title, text) => fire('info', title, text),
  warning: (title, text) => fire('warning', title, text),
};

export default toast;
