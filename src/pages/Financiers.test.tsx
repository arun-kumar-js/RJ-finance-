import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import Financiers from './Financiers';
import * as adminService from '../services/adminService';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock adminService APIs
vi.mock('../services/adminService', () => ({
  getUsers: vi.fn(),
  createUser: vi.fn(),
  deleteUser: vi.fn(),
  updateUser: vi.fn(),
}));

describe('Financiers Component', () => {
  const mockFinanciersList = [
    { _id: 'f1', name: 'John Financier', mobile: '9876543210', role: 'finance' },
    { _id: 'f2', name: 'Jane Financier', mobile: '8765432109', role: 'finance' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mock implementation for getUsers
    vi.mocked(adminService.getUsers).mockResolvedValue(mockFinanciersList);
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <Financiers />
      </Provider>
    );
  };

  it('renders the list of financiers correctly', async () => {
    renderComponent();

    // Shows loading first
    expect(screen.getByText(/loading financiers.../i)).toBeInTheDocument();

    // Wait for list to render
    await waitFor(() => {
      expect(screen.getByText('John Financier')).toBeInTheDocument();
      expect(screen.getByText('Jane Financier')).toBeInTheDocument();
    });

    // Check formatting
    expect(screen.getByText(/9876543210/)).toBeInTheDocument();
    expect(screen.getByText(/8765432109/)).toBeInTheDocument();
  });

  it('opens the "Add New Financier" modal when the "+" button is clicked', async () => {
    renderComponent();
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByText('John Financier')).toBeInTheDocument();
    });

    // Find the add button (labeled "+")
    const addButton = screen.getByText('+');
    fireEvent.click(addButton);

    // Verify modal elements are visible
    expect(screen.getByText('Add New Financier')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('10 digits')).toBeInTheDocument();
  });

  it('performs validation when saving with empty fields', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    renderComponent();

    // Wait for load
    await waitFor(() => {
      expect(screen.getByText('John Financier')).toBeInTheDocument();
    });

    // Open modal
    fireEvent.click(screen.getByText('+'));

    // Click Save (which calls handleSubmitClick)
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    // Verify validation alert triggers
    expect(alertMock).toHaveBeenCalledWith('Name, phone, and password are required');
    alertMock.mockRestore();
  });

  it('opens the password confirmation modal on valid form submission', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Financier')).toBeInTheDocument();
    });

    // Open modal
    fireEvent.click(screen.getByText('+'));

    // Fill in required fields
    fireEvent.change(screen.getByPlaceholderText('e.g. John Doe'), { target: { value: 'New Test Financier' } });
    fireEvent.change(screen.getByPlaceholderText('10 digits'), { target: { value: '9999999999' } });
    fireEvent.change(screen.getByPlaceholderText('Minimum 6 characters'), { target: { value: 'secretpwd123' } });

    // Click Save
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    // Verify the PasswordPromptModal is now open in the DOM
    await waitFor(() => {
      expect(screen.getByText('Save Financier')).toBeInTheDocument();
    });
  });
});
