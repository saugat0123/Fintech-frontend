import {AfterViewInit, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-gauge-chart',
  template: `
        <div [id]="gaugeIdentifier"></div>`
})
export class GaugeChartComponent implements AfterViewInit, OnChanges {
  @Input() maxValue: number;
  @Input() obtainedValue: number;
  @Input() chartWidth: number;
  @Input() chartHeight: number;
  @Input() gaugeIdentifier: string;
  gaugeMap = {};
  powerGauge;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['obtainedValue'].isFirstChange()) {
      this.draw();
    } else {
      this.powerGauge['update'](this.obtainedValue);
    }
  }

  ngAfterViewInit() {
    this.draw();
  }

  draw() {
    const self = this;
    const gauge = function (container, configuration) {

      const config = {
        size: 710,
        clipWidth: 200,
        clipHeight: 110,
        ringInset: 20,
        ringWidth: 20,

        pointerWidth: 10,
        pointerTailLength: 5,
        pointerHeadLengthPercent: 0.9,

        minValue: 0,
        maxValue: 10,

        minAngle: -90,
        maxAngle: 90,

        transitionMs: 750,

        majorTicks: 10,
        labelFormat: d3.format('d'),
        labelInset: 10,

        arcColorFn: d3.interpolateHsl(d3.rgb('#8aed13'), d3.rgb('#9e3140'))
      };
      let range;
      let r;
      let pointerHeadLength;

      let svg;
      let arc;
      let scale;
      let ticks;
      let tickData;
      let pointer;

      function deg2rad(deg) {
        return deg * Math.PI / 180;
      }

      function configure(configurationParam) {
        let prop;
        for (prop in configurationParam) {
          if (configurationParam.hasOwnProperty(prop)) {
            config[prop] = configurationParam[prop];
          }
        }

        range = config.maxAngle - config.minAngle;
        r = config.size / 2;
        pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

        // a linear scale this.gaugeMap maps domain values to a percent from 0..1
        scale = d3.scaleLinear()
            .range([0, 1])
            .domain([config.minValue, config.maxValue]);

        ticks = scale.ticks(config.majorTicks);
        tickData = d3.range(config.majorTicks).map(function () {
          return 1 / config.majorTicks;
        });

        arc = d3.arc()
            .innerRadius(r - config.ringWidth - config.ringInset)
            .outerRadius(r - config.ringInset)
            .startAngle(function (d, i) {
              const ratio = Number(d) * i;
              return deg2rad(config.minAngle + (ratio * range));
            })
            .endAngle(function (d, i) {
              const ratio = Number(d) * (i + 1);
              return deg2rad(config.minAngle + (ratio * range));
            });
      }

      self.gaugeMap['configure'] = configure;

      function centerTranslation() {
        return 'translate(' + r + ',' + r + ')';
      }

      function isRendered() {
        return (svg !== undefined);
      }

      self.gaugeMap['isRendered'] = isRendered;

      function render(newValue) {
        svg = d3.select(container)
            .append('svg:svg')
            .attr('class', 'gauge')
            .attr('width', config.clipWidth)
            .attr('height', config.clipHeight);

        const centerTx = centerTranslation();

        const arcs = svg.append('g')
            .attr('class', 'arc')
            .attr('transform', centerTx);

        arcs.selectAll('path')
            .data(tickData)
            .enter().append('path')
            .attr('fill', function (d, i) {
              return config.arcColorFn(d * i);
            })
            .attr('d', arc);

        const lg = svg.append('g')
            .attr('class', 'label')
            .attr('transform', centerTx);
        lg.selectAll('text')
            .data(ticks)
            .enter().append('text')
            .attr('transform', function (d) {
              const ratio = scale(d);
              const newAngle = config.minAngle + (ratio * range);
              return 'rotate(' + newAngle + ') translate(0,' + (config.labelInset - r) + ')';
            })
            .text(config.labelFormat);

        const lineData = [[config.pointerWidth / 2, 0],
          [0, -pointerHeadLength],
          [-(config.pointerWidth / 2), 0],
          [0, config.pointerTailLength],
          [config.pointerWidth / 2, 0]];
        const pointerLine = d3.line().curve(d3.curveLinear);
        const pg = svg.append('g').data([lineData])
            .attr('class', 'pointer')
            .attr('transform', centerTx);

        pointer = pg.append('path')
            .attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/)
            .attr('transform', 'rotate(' + config.minAngle + ')');

        update(newValue === undefined ? 0 : newValue);
      }

      self.gaugeMap['render'] = render;

      function update(newValue, newConfiguration?) {
        if (newConfiguration !== undefined) {
          configure(newConfiguration);
        }
        const ratio = scale(newValue);
        const newAngle = config.minAngle + (ratio * range);
        pointer.transition()
            .duration(config.transitionMs)
            .ease(d3.easeElastic)
            .attr('transform', 'rotate(' + newAngle + ')');
      }

      self.gaugeMap['update'] = update;

      configure(configuration);

      return self.gaugeMap;
    };

    this.powerGauge = gauge(`#${this.gaugeIdentifier}`, {
      size: this.chartWidth,
      clipWidth: this.chartWidth,
      clipHeight: this.chartHeight,
      ringWidth: (50 / 100) * Number(this.chartHeight),
      maxValue: this.maxValue,
      transitionMs: 4000,
    });
    this.powerGauge['render'](this.obtainedValue);

  }

}

