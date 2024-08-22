"use client";

import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import axios from 'axios';

const Home = () => {
  const { userName, logout } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [routineName, setRoutineName] = useState('');
  const [routineDescription, setRoutineDescription] = useState('');
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);

  // get token from local storage for use with auth checks
  const token = localStorage.getItem('token');
  console.log("Token - ", token)

  // GET all workouts and routines
  const fetchWorkoutsAndRoutines = async () => {
    try {
      const [workoutsResponse, routinesResponse] = await Promise.all([
        axios.get('http://localhost:8000/workouts/workouts', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:8000/routines', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setWorkouts(workoutsResponse.data);
      setRoutines(routinesResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Error fetching data, please try again.');
    }
  };

  // call on function to get all workouts and routines
  useEffect(() => {
    fetchWorkoutsAndRoutines();
  }, []);

  // POST a workout
  const handleCreateWorkout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/workouts', {
        name: workoutName,
        description: workoutDescription,
      });
      setWorkouts(prevWorkouts => [...prevWorkouts, response.data]);
      setWorkoutName('');
      setWorkoutDescription('');
    } catch (error) {
      console.error('Failed to create workout:', error);
      alert('Error creating workout, please try again.');
    }
  };

  // POST a routine
  const handleCreateRoutine = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/routines', {
        name: routineName,
        description: routineDescription,
        workouts: selectedWorkouts,
      });
      setRoutines(prevRoutines => [...prevRoutines, response.data]);
      setRoutineName('');
      setRoutineDescription('');
      setSelectedWorkouts([]);
    } catch (error) {
      console.error('Failed to create routine:', error);
      alert('Error creating routine, please try again.');
    }
  };

  // Delete a routine
  const deleteRoutine = async (routineId) => {
    try {
      await axios.delete(`http://localhost:8000/routines/${routineId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutines(prevRoutines => prevRoutines.filter(routine => routine.id !== routineId));
    } catch (error) {
      console.error('Failed to delete routine:', error);
      alert('Error deleting routine, please try again.');
    }
  };

  // Standardize User Name Display
  const capitalize = (str) => 
      str.split(' ')
      .map(word => word
      .charAt(0).toUpperCase()
      + word.slice(1))
      .join(' ');

  return (
    <ProtectedRoute>
      <div className="container bg-dark border border-dark mt-4">
        {/* Navbar */}
        <nav className="navbar text-light">
          <div className="container-fluid">
            <h1>Welcome {capitalize(userName)}!</h1>
            <button onClick={logout} className="btn btn-danger">Logout</button>
          </div>
        </nav>
        {/* Accordion Container */}
        <div className="accordion mt-5 mb-5" id="accordionExample">

          {/* Create Workout Section */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Create Workout
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <form onSubmit={handleCreateWorkout}>
                  <div className="mb-3">
                    <label htmlFor="workoutName" className="form-label">Workout Name</label>
                    <input type="text" className="form-control" id="workoutName" value={workoutName} onChange={(e) => setWorkoutName(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="workoutDescription" className="form-label">Workout Description</label>
                    <input type="text" className="form-control" id="workoutDescription" value={workoutDescription} onChange={(e) => setWorkoutDescription(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary">Create Workout</button>
                </form>
              </div>
            </div>
          </div>

          {/* Create Routine Section */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Create Routine
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <form onSubmit={handleCreateRoutine}>
                  <div className="mb-3">
                    <label htmlFor="routineName" className="form-label">Routine Name</label>
                    <input type="text" className="form-control" id="routineName" value={routineName} onChange={(e) => setRoutineName(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="routineDescription" className="form-label">Routine Description</label>
                    <input type="text" className="form-control" id="routineDescription" value={routineDescription} onChange={(e) => setRoutineDescription(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="workoutSelect" className="form-label">Select Workouts</label>
                    <select multiple className="form-control" id="workoutSelect" value={selectedWorkouts} onChange={(e) => setSelectedWorkouts([...e.target.selectedOptions].map(option => option.value))}>
                      {workouts.map(workout => (
                        <option key={workout.id} value={workout.id}>{workout.name}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Create Routine</button>
                </form>
              </div>
            </div>
          </div>

          {/* Your Routines Section */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingThree">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                Your Routines
              </button>
            </h2>
            <div id="collapseThree" className="accordion-collapse collapse show" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                {routines.length === 0 ? 
                  <p>Once you create a routine, it will be displayed here.</p>
                :
                  <ul>
                    {routines.map(routine => (
                      <div className="card p-3" key={routine.id}>
                        <div className="card-body p-0 d-flex justify-content-between">
                          <h5 className="card-title">{routine.name}</h5>
                          <button onClick={() => deleteRoutine(routine.id)} className="btn btn-danger">Delete</button>
                        </div>
                        <p className="card-text">{routine.description}</p>
                        <ul className="card-text"> 
                          {routine.workouts && routine.workouts.map(workout => (
                            <li key={workout.id}>
                              {workout.name}: {workout.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </ul>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Home;