# colab-widget-dev

## dev
### local
```
yarn watch # build dist.js on localhost:1234
yarn local # simulate widget at localhost:5000
```

### colab
```
yarn watch # build dist.js on localhost:1234
yarn ngrok 123 # open port to watch script
(paste python widget bit in colab, point to ngrok url)
(update python function defs, etc.)
```

example at https://colab.research.google.com/drive/1IVzG_EVXHNqzZdTF7pLhkbEMYI-2IEQx#scrollTo=ZXTDD5IiZhRj


## plumbing
here's the plumbing to make a colab widget, adapted from the WIT:
https://github.com/jameswex/tensorboard/blob/2189ddc9199fd3b89e1363ec360ce5266c987e20/tensorboard/plugins/interactive_inference/witwidget/notebook/colab/wit.py#L201

### python widget
```
from google.colab import output
from IPython import display

def mutate(widget_id):
  output.eval_js("""testCallback('{widget_id}')""".format(widget_id=widget_id))
output.register_callback('notebook.Mutate', mutate)

WIDGET_HTML = """
  <div id="widget">Loading...</div>
  <script>
    const el = document.querySelector("#widget");
    el.parentElement.style.height = '{height}px';
    el.parentElement.style.border = '2px solid #333';
    el.parentElement.style.padding = '5px';
    el.textContent = 'Done.';

    el.addEventListener('click', e => {{
      google.colab.kernel.invokeFunction('notebook.Mutate', [42], {{}});
    }});
    window.testCallback = n => {{
      alert('python got: ' + n.toString());
    }};

    const scriptEl = document.createElement('script');
    scriptEl.src = 'https://818b01ef.ngrok.io/dist.js';
    scriptEl.onload = e => {{
      colabWidgetMain({{
        invokeFunction: google.colab.kernel.invokeFunction.bind(google.colab.kernel),
        el: el.parentElement,
        window: window
      }});
    }};
    el.appendChild(scriptEl);
  </script>
  """

display.display(display.HTML(WIDGET_HTML.format(height=300, id=77)))
```

### js api
```
window.colabWidgetMain = function colabWidgetMain(widgetContext) {
  const {invokeFunction, el, window} = widgetContext;
  el.textContent = 'hello!';
  invokeFunction('notebook.Mutate', [48]);
}
```