import React, { useState, useEffect } from 'react';
import './TaskColumn.css';
import { Card, Typography, Chip, Menu, MenuItem, } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from 'date-fns'; 
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import { updateTask, fetchTasksByStatus } from './firestoreOperations'; 
import dele from './images/delete.png';


const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    padding: '0px 0 10px',
  },
}));


const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  font:'bold',
  padding: '8px 20px',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
  '&.Mui-selected': {
    backgroundColor: '#f5f5f5',
  },
  '&:not(:last-child)': {
    borderBottom: '1px solid #e0e0e0',
  },
}));


const StyledMenuHeader = styled(Typography)(({ theme }) => ({
  backgroundColor: '#e4ecff',
  color: '#262626',
  fontSize: '1rem',
  fontWeight: 600,
  padding: '10px 15px',
  marginTop: '0px',
  width: '100%',
  boxSizing: 'border-box',
  borderBottom: '1px solid #e0e0e0',
}));

const TaskColumn = ({ title, status, headerColor, onStatusChange,handleDeleteTask }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksFromFirestore = await fetchTasksByStatus(status);
        setTasks(tasksFromFirestore);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [status]); 

  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskIndex(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedTaskIndex(null);
  };

  const handleStatusChange = async (newStatus) => {
    if (selectedTaskIndex === null) return;
    
    const task = tasks[selectedTaskIndex];
    try {
      await updateTask(task.id, { status: newStatus });
      if (typeof onStatusChange === 'function') {
        onStatusChange(); 
      } else {
        console.error('onStatusChange prop is not a function');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
    handleClose();
    window.location.reload();

  };

  return (
    <div className="outer-container">
      <div className="header" style={{ backgroundColor: headerColor }}>
        <h3 className="header-title">{title}</h3>
      </div>
      <div className="task-list-container">
        {tasks.map((task, index) => (
          <Card 
          key={task.id} 
          className="task-card"
          sx={{ 
            borderRadius: '12px', 
            border: '1px solid #eee',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '2px', 
              height: '33%',
              backgroundColor: headerColor, 
              zIndex: 1,
              marginTop:'50px',
              borderRadius: '10px'
            }
          }}
        >
            <div className="task-header">
              <Chip 
                label={task.priority} 
                className={`priority-chip ${task.priority.toLowerCase()}`} 
                sx={{ borderRadius: '5px' }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '1.2rem', 
                    display: 'inline-flex', 
                    alignItems: 'center',
                    color: '#2c0f6d',
                    marginLeft: '15px',
                    marginTop: '15px',
                  }}
                >
                  {task.title}
                  <Box sx={{ position: 'relative', width: '100%' }}>
                    <ExpandMoreIcon
                      sx={{
                        position: 'absolute', 
                        right: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '20px',
                        height: '20px',
                        color: '#333'
                      }}
                      onClick={(event) => handleClick(event, index)}
                    />
                  </Box>
                </Typography>
              </div>
            </div>
            <Typography
              sx={{
                position: 'relative',
                marginLeft: '15px',
                paddingBottom: '10px', 
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 'calc(100% - 15px)', 
                  borderBottom: '3px solid #eee',
                }
              }}
              className="task-description"
            >
              {task.description}
            </Typography>


            <img src={dele} width="30" height="30"alt="img" class="delete" onClick={() => handleDeleteTask(task.id)} /> 
            

            <div className="task-footer">
              <Typography sx={{marginTop:'10px', marginLeft: '15px', marginBottom:'10px', display: 'flex', alignItems: 'center' }} className="task-date">
                <CalendarToday sx={{ marginRight: '8px' }} className="calendar-icon" />
                {format(new Date(task.date), 'MM/dd/yyyy')}
              </Typography>
            </div>
          </Card>
        ))}

        <StyledMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <StyledMenuHeader>
            Change Status
          </StyledMenuHeader>
          <StyledMenuItem onClick={() => handleStatusChange('TODO')}>
            Todo
          </StyledMenuItem>
          <StyledMenuItem onClick={() => handleStatusChange('IN PROGRESS')}>
            In Progress
          </StyledMenuItem>
          <StyledMenuItem onClick={() => handleStatusChange('COMPLETED')}>
            Completed
          </StyledMenuItem>
        </StyledMenu>
      </div>
    </div>
  );
};

export default TaskColumn;
