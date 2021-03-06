'use strict';

const { Router } = require('express');
const placesRouter = new Router();

const Place = require('./../models/place');

placesRouter.get('/', (req, res, next) => {
  Place.find()
    .then(places => {
      res.render('places/display', { places });
    })
    /*
const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  const radius = req.query.radius;

  Restaurant.find()
    .where('location')
    .within()
    .circle({ center: [longitude, latitude], radius: metersToDegrees(radius) })
    .then(restaurants => {
      res.render('restaurant/results', { restaurants });
    })
*/
    .catch(error => {
      next(error);
    });
});

placesRouter.get('/create', (req, res) => {
  res.render('places/create');
});

placesRouter.post('/create', (req, res, next) => {
  const { name, type, latitude, longitude } = req.body;

  Place.create({
    name,
    type,
    location: { coordinates: [longitude, latitude] }
  })
    .then(place => {
      res.redirect(`/places/${place._id}`);
    })
    .catch(error => {
      next(error);
    });
});

placesRouter.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Place.findById(id)
    .then(place => {
      res.render('places/showPlace', { place });
    })
    .catch(error => {
      next(error);
    });
});

// rest of cruder

placesRouter.post('/:id/delete', (req, res, next) => {
  const id = req.params.id;

  Place.findOneAndDelete({ _id: id })
    .then(() => {
      res.redirect('/');
    })
    .catch(error => {
      next(error);
    });
});

placesRouter.get('/:id/edit', (req, res, next) => {
  const id = req.params.id;

  Place.findOne({ _id: id })
    .then(place => {
      if (place) {
        res.render('places/edit', { place });
      } else {
        next();
      }
    })
    .catch(error => {
      next(error);
    });
});

placesRouter.post('/:id/edit', (req, res, next) => {
  const id = req.params.id;
  const { content } = req.body;

  Place.findOneAndUpdate({ _id: id }, { content })
    .then(() => {
      res.redirect('/');
    })
    .catch(error => {
      next(error);
    });
});

module.exports = placesRouter;
