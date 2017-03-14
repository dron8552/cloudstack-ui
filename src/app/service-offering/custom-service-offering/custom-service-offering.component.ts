import { Component, OnInit, Inject } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';
import { ConfigService } from '../../shared/services/config.service';


export class CustomServiceOffering {
  constructor(
    public cpuNumber: number,
    public cpuSpeed: number,
    public memory: number
  ) {}
}

interface CustomOfferingRestrictions {
  cpuNumber: {
    min: number;
    max: number;
  };
  cpuSpeed: {
    min: number;
    max: number;
  };
  memory: {
    min: number;
    max: number;
  };
}

@Component({
  selector: 'cs-custom-service-offering',
  templateUrl: 'custom-service-offering.component.html',
  styleUrls: ['custom-service-offering.component.scss']
})
export class CustomServiceOfferingComponent implements OnInit {
  public offering: CustomServiceOffering;
  public restrictions: CustomOfferingRestrictions;

  constructor(
    @Inject('zoneId') public zoneId: string,
    public dialog: MdlDialogReference,
    private configService: ConfigService
  ) {}

  public ngOnInit(): void {
    if (this.zoneId == null) {
      throw new Error('Attribute \'zoneId\' is required');
    }

    this.configService.get('customOfferingRestrictions')
      .subscribe((restrictions: CustomOfferingRestrictions) => {
        try {
          this.restrictions = restrictions[this.zoneId];
        } catch (e) {
          throw new Error('Custom offering settings must be specified. Contact your administrator.');
        }
        this.offering = new CustomServiceOffering(
          this.restrictions.cpuNumber.min,
          this.restrictions.cpuSpeed.min,
          this.restrictions.memory.min
        );
      });
  }

  public onSubmit(): void {
    this.dialog.hide(this.offering);
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
