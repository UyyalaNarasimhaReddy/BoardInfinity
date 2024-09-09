import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon
import { addTask } from './firestoreOperations'; 
import './TaskModel.css'; 
const TaskModal = ({ open, handleClose }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    date: '',
    status: '',
    priority: '',
  });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    try {
      await addTask(task);
      alert('Task is added successfully');
      setTask({ title: '', description: '', date: '', status: '', priority: '' });
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modal-box">
        <Typography variant="h6" component="h2" className="modal-header">
          <Box className="plus-circle">
            <AddCircleOutlineIcon className="plus-icon" />
          </Box>
          Create New Task
          <CloseIcon className="close-button" onClick={handleClose} /> 
        </Typography>
        <TextField
          required
          name="title"
          label="Title"
          fullWidth
          value={task.title}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          name="description"
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={task.description}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          required
          name="date"
          label="Select Date"
          fullWidth
          type="date"
          InputLabelProps={{ shrink: true }}
          value={task.date}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          select
          name="status"
          label="Status"
          fullWidth
          value={task.status}
          onChange={handleChange}
          margin="normal"
        >
          <MenuItem value="TODO">TODO</MenuItem>
          <MenuItem value="IN PROGRESS">IN PROGRESS</MenuItem>
          <MenuItem value="COMPLETED">COMPLETED</MenuItem>
        </TextField>
        <TextField
          select
          name="priority"
          label="Priority"
          fullWidth
          value={task.priority}
          onChange={handleChange}
          margin="normal"
        >
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
        </TextField>
        <Box className="modal-actions">
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="secondary" onClick={onSubmit}>
            Create
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TaskModal;
