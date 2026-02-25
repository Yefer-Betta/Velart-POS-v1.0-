import { addDoc, collection, getDocs, query, limit, startAfter, deleteDoc, doc } from 'firebase/firestore';
import { guardarVenta, obtenerVentas, eliminarVenta } from './ventas';
import { db } from './firebase';

jest.mock('./firebase', () => ({ db: jest.fn() }));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(() => "query_function_called"),
  orderBy: jest.fn(),
  limit: jest.fn((count) => `limit_called_with_${count}`),
  startAfter: jest.fn((doc) => `start_after_called_with_${doc}`),
  Timestamp: { now: () => new Date() }
}));

describe('Servicio de Ventas', () => {
  it('debería guardar una venta correctamente', async () => {
    const ventaMock = { producto: 'Vela', precio: 100 };
    addDoc.mockResolvedValueOnce({ id: '12345' });

    const result = await guardarVenta(ventaMock);

    expect(addDoc).toHaveBeenCalled();
    expect(result).toEqual({ id: '12345', ...ventaMock });
  });

  it('debería obtener ventas con paginación', async () => {
    const ventasMock = [
      { id: '1', producto: 'Producto 1', precio: 100 },
      { id: '2', producto: 'Producto 2', precio: 200 },
    ];

    const querySnapshotMock = {
      docs: ventasMock.map((venta) => ({ id: venta.id, data: () => venta })),
    };

    getDocs.mockResolvedValueOnce(querySnapshotMock);

    const result = await obtenerVentas(2);

    expect(query).toHaveBeenCalledWith(expect.anything(), expect.anything(), limit(2));
    expect(result).toEqual(ventasMock);
  });

  it('debería eliminar una venta correctamente', async () => {
    const idMock = '12345';
    const mockDoc = jest.fn();

    await eliminarVenta(idMock);

    expect(deleteDoc).toHaveBeenCalledWith(doc(db, 'ventas', idMock));
  });
});