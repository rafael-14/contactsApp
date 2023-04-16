import HttpClient from './utils/HttpClient';
import CategoryMapper from './mappers/CategoryMapper';

class CategoriesServices {
  constructor() {
    this.httpClient = new HttpClient('http://localhost:4000');
  }

  async listCategories(signal) {
    const categories = await this.httpClient.get('/categories', { signal });
    return categories.map(CategoryMapper.toDomain);
  }
}

export default new CategoriesServices();
