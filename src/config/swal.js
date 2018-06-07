import Swal from 'sweetalert2';

export const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

export const confirmDelete = (title = 'Are you sure?', text = "You won't be able to revert this!") =>
  new Promise(resolve => {
    Swal({
      title,
      text,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        resolve(true);
      }
    });
  });

export const prompt = (text = 'Input', inputPlaceholder = text, rest) =>
  Swal({
    title: text,
    input: 'text',
    inputPlaceholder,
    showCancelButton: true,
    inputValidator: value => {
      return !value && 'You need to write something!';
    },
    ...rest
  });
