const path = require('path');
const fs = require('fs');

const toursPath = path.join(__dirname, '../dev-data/data/tours-simple.json');

// READING DATA
const tours = JSON.parse(fs.readFileSync(toursPath, 'utf-8'));

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    results: tours?.length,
    requestedAt: req.requestTime,
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

module.exports = {
  deleteTour,
  getAllTours,
  createTour,
  getTour,
  updateTour,
};
