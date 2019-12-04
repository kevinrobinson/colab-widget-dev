
window.colabWidgetMain = function widgetMain(widgetContext) {
  const {invokeFunction, el, window} = widgetContext;
  el.textContent = 'hello!  click me';
  el.addEventListener('click', e => {
    invokeFunction('notebook.Mutate', ['you clicked!']);
  });
}
