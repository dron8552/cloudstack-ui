import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CustomEncoder } from '../../utils/encoders/custom-encoder';

import { VirtualMachine } from '../../vm/shared/vm.model';
import { BackendResource } from '../decorators';

import { SSHKeyPair } from '../models';
import { AsyncJobService } from './async-job.service';
import { BaseBackendCachedService } from './base-backend-cached.service';
import { CSCommands } from './base-backend.service';

export interface SshKeyCreationData {
  name: string;
  publicKey?: string;
}

@Injectable()
@BackendResource({
  entity: 'SSHKeyPair',
})
export class SSHKeyPairService extends BaseBackendCachedService<SSHKeyPair> {
  constructor(private asyncJobService: AsyncJobService, protected http: HttpClient) {
    super(http);
  }

  public getByParams(params): Observable<SSHKeyPair> {
    return this.getList(params).pipe(map(sshKeys => sshKeys[0]));
  }

  public create(params: SshKeyCreationData): Observable<SSHKeyPair> {
    this.invalidateCache();
    return this.sendCommand(CSCommands.Create, params).pipe(map(response => response['keypair']));
  }

  public register(params: SshKeyCreationData): Observable<SSHKeyPair> {
    this.invalidateCache();
    /*
     * + sign in ssh key should be properly encoded
     * See https://github.com/angular/angular/issues/18261
     **/
    return this.sendCommand(CSCommands.Register, params, undefined, new CustomEncoder()).pipe(
      map(response => response['keypair']),
    );
  }

  public reset(params): Observable<VirtualMachine> {
    return this.sendCommand(CSCommands.ResetForVM, params, 'SSHKey').pipe(
      switchMap(job => this.asyncJobService.queryJob(job.jobid, 'VirtualMachine')),
    );
  }
}
