const fs = require('fs');
const path = require('path');
const express = require('express');
const TOURS_URL = '/api/v1/tours';

const app = express();

//* Middleware for modifying incoming request data.
app.use(express.json());

const toursPath = path.join(__dirname, './dev-data/data/tours-simple.json');

// READING DATA
const tours = JSON.parse(fs.readFileSync(toursPath, 'utf-8'));

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours?.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  //   console.log(req.params);
  const { id } = req?.params;
  const tour = tours.find((tour) => tour.id === +id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
const createTour = (req, res) => {
  console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;

  const newTour = { ...req.body, id: newId };
  tours.push(newTour);

  fs.writeFile(toursPath, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
};

const updateTour = (req, res) => {
  //   console.log(req.params);
  const { id } = req?.params;
  const tour = tours.find((tour) => tour.id === +id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Tour updated successfully',
    },
  });
};

const deleteTour = (req, res) => {
  //   console.log(req.params);
  const { id } = req?.params;
  const tour = tours.find((tour) => tour.id === +id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
// ROUTES
// app.get(TOURS_URL, getAllTours);
// app.get(`${TOURS_URL}/:id`, getTour);
// app.post(TOURS_URL, createTour);
// app.patch(`${TOURS_URL}/:id`, updateTour);
// app.delete(`${TOURS_URL}/:id`, deleteTour);

app.route(TOURS_URL).get(getAllTours).post(createTour);
app.route(`${TOURS_URL}/:id`).get(getTour).delete(deleteTour).patch(updateTour);
const PORT = 5000;
app.listen(PORT, () => console.log(`Listening at Port ${PORT}`));
