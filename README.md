# compass
Chrome App Password Manager.  Is compatible with pass (password-store).

## build instructions

1. Clone the repo
2. `npm install`
3. `npm run build`
4. Navigate to `chrome://extensions/` and enable developer mode
5. Click 'Load unpacked extension' and select `/app/app`
6. Copy the ID from the newly installed Compass Base app into line 8 of `/extension/src/services/north.js`
7. `npm run build`
8. Click 'Load unpacked extension' and select `/extension/app`
