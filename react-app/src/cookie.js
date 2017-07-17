class Cookie {
  get(name) {
    let match = document.cookie.match(new RegExp(name + '=([^;]+)'));
    if (match) return match[1];
  }

  set(name, value, options) {
    options = options || {};

    let expires = options.expires;

    if(typeof expires === 'number' && expires) {
      let d = new Date();
      d.setTime(d.getTime() + expires * 1000);
      expires = options.expires = d;
    }

    if(expires && expires.toUTCString) {
      options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    let updatedCookie = name + '=' + value;

    for(let propName in options) {
      updatedCookie += '; ' + propName;
      let propValue = options[propName];
      if(propValue !== true) {
        updatedCookie += '=' + propValue;
      }
    }

    document.cookie = updatedCookie;
  }

  update(name, value, options) {
    value = value || this.get(name);
    this.set(name, value, options);
  }

  remove(name) {
    this.set(name, '', {
      expires: new Date(Date.now() - 86400000).toUTCString()
    });
  }
}

export default new Cookie();