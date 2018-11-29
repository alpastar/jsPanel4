/* jspanel.modal.js (c) Stefan Sträßer(Flyer53) <info@jspanel.de> license: MIT */
/* global jsPanel */
'use strict';

//import {jsPanel} from '../../jspanel.js';

/*
If option.dragit is enabled on a modal AND an already open panel has option.syncMargins set to true the modal somehow inherits
the option.dragit.containment setting of the already open panel. Reason unknown!
Workaround: Set option.dragit.containment to a suitable value on the modal.
 */

if (!jsPanel.modal) {

    jsPanel.modal = {

        version: '1.0.2',
        date: '2018-11-08 16:55',

        defaults: {
            closeOnEscape:  true,
            dragit:         false,
            headerControls: 'closeonly',
            resizeit:       false,
            syncMargins:    false
        },

        addBackdrop(id) {
            let modalCount = document.getElementsByClassName('jsPanel-modal-backdrop').length,
                mb = document.createElement('div');
            mb.id = 'jsPanel-modal-backdrop-' + id;
            if (modalCount === 0) {
                mb.className = 'jsPanel-modal-backdrop';
            } else if (modalCount > 0) {
                mb.className = 'jsPanel-modal-backdrop jsPanel-modal-backdrop-multi';
            }
            mb.style.zIndex = this.ziModal.next();
            return mb;
        },

        removeBackdrop(id) {
            let mb = document.getElementById(`jsPanel-modal-backdrop-${id}`);
            mb.classList.add('jsPanel-modal-backdrop-out');
            let delay = parseFloat(getComputedStyle(mb).animationDuration) * 1000;
            window.setTimeout(function() {
                document.body.removeChild(mb);
            }, delay);
        },

        create(options = {}) {
            options.paneltype = 'modal';
            if (!options.id) {
                options.id = `jsPanel-${jsPanel.idCounter += 1}`;
            } else if (typeof options.id === 'function') {
                options.id = options.id();
            }

            let opts = options,
                backdrop = this.addBackdrop(opts.id);
            if (options.config) {
                opts = Object.assign({}, options.config, options);
                delete opts.config;
            }
            opts = Object.assign({}, this.defaults, opts, {container: 'window'});

            document.body.append(backdrop);

            let remBackdrop = function (e) {
                let id = e.detail;
                if (id === opts.id) {
                    jsPanel.modal.removeBackdrop(id);
                    document.removeEventListener('jspanelclosed', remBackdrop, false);
                }
            };

            document.addEventListener('jspanelclosed', remBackdrop, false);

            return jsPanel.create(opts, modal => {
                modal.style.zIndex = jsPanel.modal.ziModal.next();
                modal.header.style.cursor = 'default';
                modal.footer.style.cursor = 'default';
                // close modal on click in backdrop
                jsPanel.pointerdown.forEach(function (evt) {
                    document.getElementById(`jsPanel-modal-backdrop-${opts.id}`).addEventListener(evt, function () {
                        modal.close();
                    });
                });
            });

        }

    };

    jsPanel.modal.ziModal = (() => {
        let val = 10000;
        return {
            next: function() {
                return val++;
            }
        };
    })();

}

if (typeof module !== 'undefined') {
  module.exports = jsPanel
}
