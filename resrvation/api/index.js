const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const Transport = require('./models/Transport.js');
const BookingTransport = require('./models/BookingTransport.js');

const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const authenticateToken = require('./middlewares/authenticateToken');

require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'dcbd5e32bhr78r49r845b';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGO_URL);

function getUserDataFromReq(req) {
    return new Promise((resolve,reject)  => {
        jwt.verify(req.cookies.token , jwtSecret, {}, async (err, userData) => {
            if(err) throw err;
             resolve(userData);
          });
    });
}

app.get('/test', (req, res) => {
    res.json('test ok');
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json({ userDoc });
    } catch (e) {
        res.status(422).json(e);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });

    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({
                email: userDoc.email,
                id: userDoc._id,
            }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            });
        } else {
            res.status(422).json('pass not ok');
        }
    } else {
        res.json('not found');
    }
});

app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const { name, email, _id } = await User.findById(req.user.id);
        res.json({ name, email, _id });
    } catch (error) {
        console.error('Error in /profile route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('token').json(true); // Utiliser clearCookie pour supprimer le cookie
});

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName, // Ajouter un / après uploads
    });
    res.json(newName);
});

const photosMiddleware = multer({ dest: 'uploads/' });
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newName = 'photo' + Date.now() + '.' + ext;
        const newPath = 'uploads/' + newName; // Chemin correct de l'image
        fs.renameSync(path, newPath);
        uploadedFiles.push(newName);
    }
    res.json(uploadedFiles);
}); 


app.post('/places', authenticateToken, async (req, res) => {
    const {
        title, address, addedPhotos, description, perks, extraInfo,
        checkIn, checkOut, maxGuests, price
    } = req.body;

    try {
        const placeDoc = await Place.create({
            owner: req.user.id, price, title, address, photos: addedPhotos, description,
            perks, extraInfo, checkIn, checkOut, maxGuests,
        });
        res.json(placeDoc);
    } catch (error) {
        console.error('Error creating place:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/user-places', authenticateToken, async (req, res) => {
    try {
        const { id } = req.user;
        const places = await Place.find({ owner: id });
        res.json(places);
    } catch (error) {
        console.error('Error fetching user places:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/places/:id',async (req,res) => {
    const {id} = req.params;;
    res.json(await Place.findById(id));
})
app.put('/places', async (req,res) => {
    const {token} = req.cookies;
    const {
    id,title,address,addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
  const placeDoc = await Place.findById(id); 
  if (userData.id===placeDoc.owner.toString()){
   placeDoc.set({
    title,address,photos:addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price,
    });
    await placeDoc.save();
    res.json('ok');
  }
  });
});  

app.get('/places',async (req,res) => {
  res.json(await Place.find());
})


app.post('/bookings', authenticateToken, async (req, res) => {
    const userData = req.user;
    const {
        place, checkIn, checkOut, numberOfGuests, name, phone, price,
    } = req.body;

    if (!place || !checkIn || !checkOut || !numberOfGuests || !name || !phone || !price) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const booking = await Booking.create({
            place, checkIn, checkOut, numberOfGuests, name, phone, price, user: userData.id,
        });
        res.json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/bookings', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const bookings = await Booking.find({ user: userId }).populate('place');
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// Endpoint pour supprimer une réservation de place
app.delete('/bookings/:id', authenticateToken, async (req, res) => {
    const bookingId = req.params.id;

    try {
        // Supprimer la réservation de la base de données
        await Booking.findByIdAndDelete(bookingId);

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Endpoint pour modifier une réservation
app.put('/bookings/:id', async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut, numberOfGuests, name, phone, price } = req.body;
    try {
        await Booking.findByIdAndUpdate(id, {
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            price,
        });
        res.json({ message: 'Booking updated successfully' });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint pour mettre à jour une réservation
app.put('/bookings/:id/update', async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut, numberOfGuests, name, phone, price } = req.body;
    try {
        await Booking.findByIdAndUpdate(id, {
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            price,
        });
        res.json({ message: 'Booking updated successfully' });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.put('/bookings/:id/validate', async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);

        // Vérifier si le booking existe
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Vérifier si la réservation est déjà validée
        if (booking.status === 'validated') {
            return res.status(400).json({ error: 'Booking already validated' });
        }

        // Mettre à jour le statut de la réservation avec l'ID fourni
        await Booking.findByIdAndUpdate(id, { status: 'validated' });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error validating booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// Route pour supprimer une place par ID
app.delete('/places/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPlace = await Place.findByIdAndDelete(id);
        if (!deletedPlace) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.status(200).json({ message: 'Place deleted successfully' });
    } catch (error) {
        console.error('Error deleting place:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Endpoint pour récupérer les détails d'une réservation par son ID
app.get('/bookings/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await Booking.findById(id).populate('place').populate('user');
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.post('/transports', authenticateToken, async (req, res) => {
    try {
        const {
            title, address, description, addedPhotos, extraInfo, price,checkIn,checkOut,
        } = req.body;
        const transportDoc = await Transport.create({
            owner: req.user.id, title, address, description, photos: addedPhotos, extraInfo, price,checkIn,checkOut,
        });
        res.json(transportDoc);
    } catch (error) {
        console.error('Error creating transport:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/user-transports', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const userTransports = await Transport.find({ owner: userId });
        res.json(userTransports);
    } catch (error) {
        console.error('Error fetching user transports:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/all-transports', async (req, res) => {
    try {
        const allTransports = await Transport.find();
        res.json(allTransports);
    } catch (error) {
        console.error('Error fetching all transports:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/transports/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const transportDetails = await Transport.findById(id);
        res.json(transportDetails);
    } catch (error) {
        console.error('Error fetching transport details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/transports/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title, address, description, addedPhotos, extraInfo, price,checkIn,checkOut,
        } = req.body;
        const transportDoc = await Transport.findById(id);
        if (req.user.id === transportDoc.owner.toString()) {
            transportDoc.set({
                title, address, description, photos: addedPhotos, extraInfo, price,checkIn,checkOut,
            });
            await transportDoc.save();
            res.json({ message: 'Transport updated successfully', transport: transportDoc });
        } else {
            res.status(403).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        console.error('Error updating transport:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint pour récupérer les détails d'un transport par son ID
app.get('/transport/Book/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const transportDetails = await Transport.findById(id);
        if (!transportDetails) {
            return res.status(404).json({ error: 'Transport not found' });
        }
        res.json(transportDetails);
    } catch (error) {
        console.error('Error fetching transport details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.delete('/transports/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const transportDoc = await Transport.findById(id);
        if (req.user.id === transportDoc.owner.toString()) {
            await Transport.findByIdAndDelete(id);
            res.json({ message: 'Transport deleted successfully' });
        } else {
            res.status(403).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        console.error('Error deleting transport:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}); 

// Endpoint pour créer un transport avec calcul du prix
app.post('/transports', authenticateToken, async (req, res) => {
    try {
        const { title, address, description, addedPhotos, extraInfo, checkIn, checkOut } = req.body;
        const price = calculatePrice(checkIn, checkOut); // Fonction de calcul du prix
        const transportDoc = await Transport.create({
            owner: req.user.id, title, address, description, photos: addedPhotos, extraInfo, price, checkIn, checkOut,
        });
        res.json(transportDoc);
    } catch (error) {
        console.error('Error creating transport:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/bookings-transport', authenticateToken, async (req, res) => {
    const userData = req.user;
    const { transport, checkIn, checkOut, name, phone } = req.body;

    if (!transport || !checkIn || !checkOut || !name || !phone) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const transportDetails = await Transport.findById(transport);
        const price = transportDetails.price;

        const booking = await BookingTransport.create({
            transport, checkIn, checkOut, name, phone, price, user: userData.id,
        });
        res.json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/user-transport-bookings', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const transportBookings = await BookingTransport.find({ user: userId }).populate('transport');
        res.json(transportBookings);
    } catch (error) {
        console.error('Error fetching transport bookings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.delete('/bookings/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await BookingTransport.findByIdAndDelete(id);
        res.json({ message: 'Transport booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting transport booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





app.get('/bookings-transport/:id', authenticateToken, async (req, res) => {
    try {
      const bookingId = req.params.id;
      const booking = await BookingTransport.findById(bookingId).populate('transport');
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.json(booking);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


// Endpoint pour supprimer une réservation de transport
app.delete('/transport/bookings/:id', authenticateToken, async (req, res) => {
    const bookingId = req.params.id;

    try {
        // Supprimer la réservation de la base de données
        await BookingTransport.findByIdAndDelete(bookingId);

        res.status(200).json({ message: 'Transport booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting transport booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/transport/bookings/:id', async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut, name, phone, price, status } = req.body;

    try {
        const updatedBooking = await BookingTransport.findByIdAndUpdate(
            id,
            { checkIn, checkOut, name, phone, price, status },
            { new: true, runValidators: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking', error });
    }
});

// Récupération des données du transport à éditer
app.get('/transports/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const transportDetails = await Transport.findById(id);
        res.json(transportDetails);
    } catch (error) {
        console.error('Error fetching transport details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Mise à jour du transport
app.put('/transports/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title, address, description, addedPhotos, extraInfo, price, checkIn, checkOut,
        } = req.body;
        const transportDoc = await Transport.findById(id);
        if (req.user.id === transportDoc.owner.toString()) {
            transportDoc.set({
                title, address, description, photos: addedPhotos, extraInfo, price, checkIn, checkOut,
            });
            await transportDoc.save();
            res.json({ message: 'Transport updated successfully', transport: transportDoc });
        } else {
            res.status(403).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        console.error('Error updating transport:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.put('/transports/:id/validate', async (req, res) => {
    try {
        const { id } = req.params;
        // Mettre à jour le statut de la réservation avec l'ID fourni
        await BookingTransport.findByIdAndUpdate(id, { status: 'validated' });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error validating transport booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/bookings-transport/:id/validate', async (req, res) => {
    try {
        const { id } = req.params;
        // Recherche de la réservation de transport avec l'ID spécifié
        const booking = await BookingTransport.findById(id);
        if (!booking) {
            return res.status(404).json({ error: 'Transport booking not found' });
        }

        // Vérifier si la réservation de transport est déjà validée
        if (booking.status === 'validated') {
            return res.status(400).json({ error: 'Transport booking already validated' });
        }

        // Mettre à jour le statut de la réservation de transport avec l'ID fourni
        await BookingTransport.findByIdAndUpdate(id, { status: 'validated' });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error validating transport booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.put('/transports/:id/update', async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut, name, phone, price } = req.body;
    try {
        await BookingTransport.findByIdAndUpdate(id, {
            checkIn,
            checkOut,
            name,
            phone,
            price,
        });
        res.json({ message: 'Booking updated successfully' });
    } catch (error) {
        console.error('Error updating transport booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/transport/bookings', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const transportBookings = await BookingTransport.find({ user: userId }).populate('transport');
        res.json(transportBookings);
    } catch (error) {
        console.error('Error fetching transport bookings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/my-accommodation-bookings', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const accommodations = await Place.find({ owner: userId }).select('_id');
        const bookings = await Booking.find({ place: { $in: accommodations } }).populate('place').populate('user');
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching accommodation bookings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/owner/bookings', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch accommodations and transport owned by the user
        const accommodations = await Place.find({ owner: userId }).select('_id');
        const transports = await Transport.find({ owner: userId }).select('_id');

        // Fetch bookings related to the accommodations and transports
        const accommodationBookings = await Booking.find({ place: { $in: accommodations } }).populate('place').populate('user');
        const transportBookings = await BookingTransport.find({ transport: { $in: transports } }).populate('transport').populate('user');

        // Combine both bookings
        const allBookings = accommodationBookings.concat(transportBookings);

        res.json(allBookings);
    } catch (error) {
        console.error('Error fetching owner bookings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/owner/bookings/:id/validate', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const bookingId = req.params.id;

        // Find the booking and validate ownership
        const booking = await Booking.findById(bookingId).populate('place');
        const transportBooking = await BookingTransport.findById(bookingId).populate('transport');

        if (booking && booking.place.owner.toString() === userId) {
            booking.status = 'validated';
            await booking.save();
            res.json({ message: 'Booking validated successfully' });
        } else if (transportBooking && transportBooking.transport.owner.toString() === userId) {
            transportBooking.status = 'validated';
            await transportBooking.save();
            res.json({ message: 'Transport booking validated successfully' });
        } else {
            res.status(403).json({ error: 'Unauthorized action' });
        }
    } catch (error) {
        console.error('Error validating booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});






app.listen(4000, () => {
    console.log('Server running on port 4000');
});