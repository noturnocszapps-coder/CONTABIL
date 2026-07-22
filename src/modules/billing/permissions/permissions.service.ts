import { PlanTier, PlanPermissions } from '../../../types/billing';
import { PermissionService } from '../../../services/permission.service';

export class PermissionsService {
  static getPermissions(plan: PlanTier = 'FREE'): PlanPermissions {
    return PermissionService.getPermissions(plan);
  }
}

export { PermissionService };

