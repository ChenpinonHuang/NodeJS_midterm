const { index, show, new: _new, edit, create, update, delete: _delete } = require('../controllers/ReservationsController');

function auth (req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash('danger', 'You need to login first.');
    return res.redirect('/login');
  }
  next();
}

module.exports = router => {
  // put your routes here
  router.get('/blogs', index); 
  router.get('/blogs/new', auth, _new); 
  router.post('/blogs', auth, create);  
  router.post('/blogs/update', auth, update);  
  router.post('/blogs/delete', auth, _delete);  
  router.get('/blogs/:id/edit', auth, edit);  
  router.get('/blogs/:id', show);
};