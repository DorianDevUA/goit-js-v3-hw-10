import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  form: document.querySelector('.form'),
};

refs.form.addEventListener('submit', onFormSubmit);

function onFormSubmit(evt) {
  evt.preventDefault();
  const form = evt.currentTarget;
  const ms = parseInt(form.elements.delay.value);
  const state = form.elements.state.value;

  createPromise(state, ms)
    .then(delay =>
      iziToast.success({
        position: 'topRight',
        title: 'OK',
        message: `Fulfilled promise in ${delay}ms`,
      })
    )
    .catch(delay =>
      iziToast.error({
        position: 'topRight',
        title: 'Error',
        message: `Rejected promise in ${delay}ms`,
      })
    );

  form.reset();
}

function createPromise(status, delay) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (status === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay)
  );
}
