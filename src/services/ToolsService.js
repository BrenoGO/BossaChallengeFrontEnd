import { ApiService } from './ApiService';

const endpoint = 'tools';
export const ToolsService = {
  list(){
    return ApiService.get(endpoint);
  },
  searchTag(tag){
    return ApiService.get(`${endpoint}?tag=${tag}`);
  },
  create(tool){
    return ApiService.post(endpoint, tool);
  },
  remove(toolId){
    return ApiService.delete(endpoint, toolId)
  }
}