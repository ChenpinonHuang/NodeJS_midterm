// You need to complete this controller with the required 7 actions
const viewPath = 'reservations';
const Reservation = require('../models/reservation');
const User = require('../models/user');

exports.index = async (req, res) => {
  try {
    const reservations = await Reservation
      .find()
      .populate('user')
      .sort({updatedAt: 'desc'});

    res.render(`${viewPath}/index`, {
      pageTitle: 'Room status',
      reservations: reservations,
      user: user,
      numOfOccupants: numOfOccupants,
      roomType: roomType,
      checkIn: checkIn,
      checkOut: checkOut
    });
  } catch (error) {
    req.flash('danger', `There was an error when show the room: ${error}`);
    res.redirect('/');
  }
};

exports.show = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('user');
    console.log(reservation);
    res.render(`${viewPath}/show`, {
      pageTitle: 'Info of reservations',
      reservation: reservation
    });
  } catch (error) {
    req.flash('danger', `There was an error when show the info: ${error}`);
    res.redirect('/');
  }
};

exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: 'New Reservation'
  });
};

exports.create = async (req, res) => {
  try {
    console.log(req.session.passport);
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});
    console.log('User', user);
    const reservation = await Reservation.create({user: user._id, ...req.body});

    req.flash('success', 'Room reservate successfully');
    res.redirect(`/reservations/${reservation.id}`);
  } catch (error) {
    req.flash('danger', `There was an error when book the room: ${error}`);
    req.session.formData = req.body;
    res.redirect('/reservations/new');
  }
};

exports.edit = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    res.render(`${viewPath}/edit`, {
      pageTitle: reservation.title,
      formData: reservation
    });
  } catch (error) {
    req.flash('danger', `Error of changing the room info: ${error}`);
    res.redirect('/');
  }
};

exports.update = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});

    let reservation = await Reservation.findById(req.body.id);
    if (!reservation) throw new Error('Reservation could not be found');

    const attributes = {user: user._id, ...req.body};
    await Reservation.validate(attributes);
    await Reservation.findByIdAndUpdate(attributes.id, attributes);

    req.flash('success', 'The reservation info was updated successfully');
    res.redirect(`/reservations/${req.body.id}`);
  } catch (error) {
    req.flash('danger', `There was an error when update reservation info: ${error}`);
    res.redirect(`/reservations/${req.body.id}/edit`);
  }
};

exports.delete = async (req, res) => {
  try {
    console.log(req.body);
    await Reservation.deleteOne({_id: req.body.id});
    req.flash('success', 'The reservation was deleted successfully');
    res.redirect(`/reservations`);
  } catch (error) {
    req.flash('danger', `There was an error deleting this reservation: ${error}`);
    res.redirect(`/reservations`);
  }
};