import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import EditCategoryModal from '../../components/modals/EditCategoryModal';
import AddCategoryModal from '../../components/modals/AddCategoryModal';
import FeedbackModal from '../../components/modals/FeedbackModal';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });
  const [newCategory, setNewCategory] = useState({
    categoryName: '',
    description: ''
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const showFeedback = (message, type = 'success') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => setFeedback({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/public/categories?pageNumber=${page}`);
      setCategories(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error.response?.data?.message || 'Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      try {
        await api.delete(`/admin/categories/${categoryId}`);
        fetchCategories();
        showFeedback('Categoría eliminada correctamente.');
      } catch (err) {
        showFeedback('Error al eliminar categoría.', 'error');
      }
    }
  };

  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setSelectedCategory(prev => ({ ...prev, [name]: value }));
    } else {
      setNewCategory(prev => ({ ...prev, [name]: value }));
    }
  };

  const submitEdit = async () => {
    try {
      await api.put(`/public/categories/${selectedCategory.categoryId}`, selectedCategory);
      setShowEditModal(false);
      setSelectedCategory(null);
      fetchCategories();
      showFeedback('Categoría actualizada correctamente.');
    } catch (err) {
      showFeedback('Error al actualizar categoría.', 'error');
    }
  };

  const submitAdd = async () => {
    try {
      await api.post(`/public/categories`, newCategory);
      setShowAddModal(false);
      setNewCategory({ categoryName: '', description: '' });
      fetchCategories();
      showFeedback('Categoría agregada correctamente.');
    } catch (err) {
      showFeedback('Error al agregar categoría.', 'error');
    }
  };

  if (loading) {
    return <div className="p-4">Loading categories...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-center mb-4" data-aos="fade-up">Categorías Disponibles</h1>

      <button 
        className="btn btn-success mb-3" 
        onClick={() => setShowAddModal(true)}
        data-aos="fade-up"
      >
        Agregar Categoría
      </button>

      <div className="table-responsive" data-aos="fade-up">
        <table className="table table-striped table-bordered shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map(category => (
                <tr key={category.categoryId}>
                  <td>{category.categoryId}</td>
                  <td>{category.categoryName}</td>
                  <td>
                    <button 
                      className="btn btn-warning btn-sm me-2" 
                      onClick={() => handleEdit(category)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => handleDelete(category.categoryId)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  No hay categorías registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                >
                  Anterior
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${i === page ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setPage(i)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      <EditCategoryModal
        show={showEditModal}
        category={selectedCategory}
        onClose={() => setShowEditModal(false)}
        onChange={(e) => handleInputChange(e, true)}
        onSubmit={submitEdit}
      />

      <AddCategoryModal
        show={showAddModal}
        category={newCategory}
        onClose={() => setShowAddModal(false)}
        onChange={(e) => handleInputChange(e)}
        onSubmit={submitAdd}
      />

      <FeedbackModal
        show={feedback.show}
        message={feedback.message}
        type={feedback.type}
        onClose={() => setFeedback({ show: false, message: '', type: 'success' })}
      />
    </div>
  );
};

export default Categories;