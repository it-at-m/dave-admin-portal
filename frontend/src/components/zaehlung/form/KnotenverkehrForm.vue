<template>
  <v-sheet
    width="100%"
    :height="height"
    :max-height="height"
    color="transparent"
    class="d-flex flex-row justify-center overflow-y-auto"
  >
    <svg
      :height="height"
      :width="height"
      viewBox="13891 17287 1111 1111"
      preserveAspectRatio="xMidYMid"
      fill-rule="evenodd"
      stroke-width="28.222"
      stroke-linejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      xml:space="preserve"
    >
      <g
        id="nodes5To8"
        class="Page"
        transform="rotate(45,14353.769,17883.631)"
      >
        <g
          id="node8_group"
          class="com.sun.star.drawing.ClosedBezierShape"
          transform="rotate(-90,14358.457,17794.588)"
        >
          <g
            id="node8"
            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"
          >
            <path
              id="path117"
              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"
              :fill="getColorOfNode('8')"
              stroke="none"
            />
            <text
              id="text117"
              xml:space="preserve"
              style="
                font-size: 63.0885px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9418;
              "
              x="23207.291"
              y="2053.7427"
              transform="matrix(0.68301124,0.68239646,-0.73271189,0.73205238,0,0)"
              :style="{ cursor: getCursorType('8') }"
              @click="activateOrDeactivateTotalNode('8')"
            >
              8
            </text>
          </g>
          <g
            v-if="isNodeAvailable('8')"
            id="node8_arrows"
          >
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node8_left"
              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"
            >
              <path
                id="path118"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('8LU')"
                @click="activateNode('8LU')"
              />
              <path
                id="path119"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('8LD')"
                @click="activateNode('8LD')"
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node8_right"
              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"
            >
              <path
                id="path120"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('8RU')"
                @click="activateNode('8RU')"
              />
              <path
                id="path121"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('8RD')"
                @click="activateNode('8RD')"
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.QU"
              id="node8_crossing"
              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"
            >
              <path
                id="path124"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('8CL2R')"
                @click="activateNode('8CL2R')"
              />
              <path
                id="path125"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('8CR2L')"
                @click="activateNode('8CR2L')"
              />
            </g>
          </g>
        </g>
        <g
          id="node7_group"
          class="com.sun.star.drawing.ClosedBezierShape"
          transform="rotate(180,14358.458,17794.588)"
        >
          <g
            id="node7"
            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"
          >
            <path
              id="path108"
              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"
              :fill="getColorOfNode('7')"
              stroke="none"
            />
            <text
              id="text108"
              xml:space="preserve"
              style="
                font-size: 63.0885px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9418;
              "
              x="2159.0249"
              y="-21628.908"
              transform="matrix(-0.68301123,0.68239646,-0.73271189,-0.73205239,0,0)"
              :style="{ cursor: getCursorType('7') }"
              @click="activateOrDeactivateTotalNode('7')"
            >
              7
            </text>
          </g>
          <g
            v-if="isNodeAvailable('7')"
            id="node7_arrows"
          >
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node7_left"
              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"
            >
              <path
                id="path109"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('7LU')"
                @click="activateNode('7LU')"
              />
              <path
                id="path110"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('7LD')"
                @click="activateNode('7LD')"
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node7_right"
              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"
            >
              <path
                id="path111"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('7RU')"
                @click="activateNode('7RU')"
              />
              <path
                id="path112"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('7RD')"
                @click="activateNode('7RD')"
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.QU"
              id="node7_crossing"
              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"
            >
              <path
                id="path115"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('7CL2R')"
                @click="activateNode('7CL2R')"
              />
              <path
                id="path116"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('7CR2L')"
                @click="activateNode('7CR2L')"
              />
            </g>
          </g>
        </g>
        <g
          id="node6_group"
          class="com.sun.star.drawing.ClosedBezierShape"
          transform="rotate(90,14358.458,17794.588)"
        >
          <g
            id="node6"
            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"
          >
            <path
              id="path99"
              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"
              :fill="getColorOfNode('6')"
              stroke="none"
            />
            <text
              id="text99"
              xml:space="preserve"
              style="
                font-size: 63.0885px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9418;
              "
              x="-23247.984"
              y="-2008.0264"
              transform="matrix(-0.68301123,-0.68239646,0.73271189,-0.73205239,0,0)"
              :style="{ cursor: getCursorType('6') }"
              @click="activateOrDeactivateTotalNode('6')"
            >
              6
            </text>
          </g>
          <g
            v-if="isNodeAvailable('6')"
            id="node6_arrows"
          >
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node6_left"
              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"
            >
              <path
                id="path100"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('6LU')"
                @click="activateNode('6LU')"
              />
              <path
                id="path101"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('6LD')"
                @click="activateNode('6LD')"
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node6_right"
              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"
            >
              <path
                id="path102"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('6RU')"
                @click="activateNode('6RU')"
              />
              <path
                id="path103"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('6RD')"
                @click="activateNode('6RD')"
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.QU"
              id="node6_crossing"
              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"
            >
              <path
                id="path106"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('6CL2R')"
                @click="activateNode('6CL2R')"
              />
              <path
                id="path107"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('6CR2L')"
                @click="activateNode('6CR2L')"
              />
            </g>
          </g>
        </g>
        <g
          id="node5_group"
          class="com.sun.star.drawing.ClosedBezierShape"
        >
          <g
            id="node5_arrow"
            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"
          >
            <path
              id="path90"
              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"
              :fill="getColorOfNode('5')"
              stroke="none"
            />
            <text
              id="text90"
              xml:space="preserve"
              style="
                font-size: 63.0885px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9418;
              "
              x="-2199.2236"
              y="21674.625"
              transform="matrix(0.68301124,-0.68239646,0.73271189,0.73205238,0,0)"
              :style="{ cursor: getCursorType('5') }"
              @click="activateOrDeactivateTotalNode('5')"
            >
              5
            </text>
          </g>
          <g
            v-if="isNodeAvailable('5')"
            id="node5_arrows"
          >
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node5_left"
              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"
            >
              <path
                id="path91"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('5LU')"
                @click="activateNode('5LU')"
              />
              <path
                id="path92"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('5LD')"
                @click="activateNode('5LD')"
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node5_right"
              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"
            >
              <path
                id="path93"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('5RU')"
                @click="activateNode('5RU')"
              />
              <path
                id="path94"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('5RD')"
                @click="activateNode('5RD')"
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.QU"
              id="node5_crossing"
              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"
            >
              <path
                id="path97"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('5CL2R')"
                @click="activateNode('5CL2R')"
              />
              <path
                id="path98"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('5CR2L')"
                @click="activateNode('5CR2L')"
              />
            </g>
          </g>
        </g>
      </g>

      <g
        id="nodes1To4"
        class="Page"
        transform="translate(61.589959,29.395208)"
      >
        <g
          id="node4_group"
          class="com.sun.star.drawing.ClosedBezierShape"
          transform="rotate(-90,14358.457,17794.588)"
        >
          <g
            id="node4"
            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"
          >
            <path
              id="path81"
              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"
              :fill="getColorOfNode('4')"
              stroke="none"
            />
            <text
              id="text81"
              xml:space="preserve"
              style="
                font-size: 63.0885px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9418;
              "
              x="17945.223"
              y="-13850.833"
              transform="matrix(0,0.96505434,-1.0362111,0,0,0)"
              :style="{ cursor: getCursorType('4') }"
              @click="activateOrDeactivateTotalNode('4')"
            >
              4
            </text>
          </g>

          <g
            v-if="isNodeAvailable('4')"
            id="node4_arrows"
          >
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node4_left"
              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"
            >
              <path
                id="path82"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('4LU')"
                @click="activateNode('4LU')"
              />
              <path
                id="path83"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('4LD')"
                @click="activateNode('4LD')"
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node4_right"
              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"
            >
              <path
                id="path84"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('4RU')"
                @click="activateNode('4RU')"
              />
              <path
                id="path85"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('4RD')"
                @click="activateNode('4RD')"
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.QU"
              id="node4_crossing"
              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"
            >
              <path
                id="path88"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('4CL2R')"
                @click="activateNode('4CL2R')"
              />
              <path
                id="path89"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('4CR2L')"
                @click="activateNode('4CR2L')"
              />
            </g>
          </g>
        </g>
        <g
          id="node3_group"
          class="com.sun.star.drawing.ClosedBezierShape"
          transform="rotate(180,14358.458,17794.588)"
        >
          <g
            id="node3"
            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"
          >
            <path
              id="path72"
              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"
              :fill="getColorOfNode('3')"
              stroke="none"
            />
            <text
              id="text72"
              xml:space="preserve"
              style="
                font-size: 63.0885px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9418;
              "
              x="-14903.439"
              y="-16723.537"
              transform="scale(-0.96592375,-1.0352784)"
              :style="{ cursor: getCursorType('3') }"
              @click="activateOrDeactivateTotalNode('3')"
            >
              3
            </text>
          </g>

          <g
            v-if="isNodeAvailable('3')"
            id="node3_arrows"
          >
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node3_left"
              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"
            >
              <path
                id="path73"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('3LU')"
                @click="activateNode('3LU')"
              />
              <path
                id="path74"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('3LD')"
                @click="activateNode('3LD')"
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node3_right"
              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"
            >
              <path
                id="path75"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('3RU')"
                @click="activateNode('3RU')"
              />
              <path
                id="path76"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('3RD')"
                @click="activateNode('3RD')"
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.QU"
              id="node3_crossing"
              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"
            >
              <path
                id="path79"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('3CL2R')"
                @click="activateNode('3CL2R')"
              />
              <path
                id="path80"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('3CR2L')"
                @click="activateNode('3CR2L')"
              />
            </g>
          </g>
        </g>
        <g
          id="node2_group"
          class="com.sun.star.drawing.ClosedBezierShape"
          transform="rotate(90,14358.458,17794.588)"
        >
          <g
            id="node2"
            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"
          >
            <path
              id="path54"
              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"
              :fill="getColorOfNode('2')"
              stroke="none"
            />
            <text
              id="text54"
              xml:space="preserve"
              style="
                font-size: 63.0885px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9418;
              "
              x="-17983.836"
              y="13896.666"
              transform="matrix(0,-0.96505434,1.0362111,0,0,0)"
              :style="{ cursor: getCursorType('2') }"
              @click="activateOrDeactivateTotalNode('2')"
            >
              2
            </text>
          </g>

          <g
            v-if="isNodeAvailable('2')"
            id="node2_arrows"
          >
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node2_left"
              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"
            >
              <path
                id="path55"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('2LU')"
                @click="activateNode('2LU')"
              />
              <path
                id="path56"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('2LD')"
                @click="activateNode('2LD')"
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node2_right"
              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"
            >
              <path
                id="path57"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('2RU')"
                @click="activateNode('2RU')"
              />
              <path
                id="path58"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('2RD')"
                @click="activateNode('2RD')"
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.QU"
              id="node2_crossing"
              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"
            >
              <path
                id="path61"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('2CL2R')"
                @click="activateNode('2CL2R')"
              />
              <path
                id="path62"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('2CR2L')"
                @click="activateNode('2CR2L')"
              />
            </g>
          </g>
        </g>
        <g
          id="node1_group"
          class="com.sun.star.drawing.ClosedBezierShape"
        >
          <g
            id="node1"
            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"
          >
            <path
              id="path1"
              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"
              :fill="getColorOfNode('1')"
              stroke="none"
            />
            <text
              id="text1"
              xml:space="preserve"
              style="
                font-size: 63.0885px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9418;
              "
              x="14863.547"
              y="16769.467"
              transform="scale(0.96592375,1.0352784)"
              :style="{ cursor: getCursorType('1') }"
              @click="activateOrDeactivateTotalNode('1')"
            >
              1
            </text>
          </g>

          <g
            v-if="isNodeAvailable('1')"
            id="node1_arrows"
          >
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node1_left"
              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"
            >
              <path
                id="path19"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('1LU')"
                @click="activateNode('1LU')"
              />
              <path
                id="path20"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('1LD')"
                @click="activateNode('1LD')"
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node1_right"
              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"
            >
              <path
                id="path39"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('1RU')"
                @click="activateNode('1RU')"
              />
              <path
                id="path40"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('1RD')"
                @click="activateNode('1RD')"
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.QU"
              id="node1_crossing"
              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"
            >
              <path
                id="path43"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('1CL2R')"
                @click="activateNode('1CL2R')"
              />
              <path
                id="path44"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('1CR2L')"
                @click="activateNode('1CR2L')"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  </v-sheet>
</template>

<script setup lang="ts">
import type ZaehlungDTO from "@/types/zaehlung/ZaehlungDTO";

import { computed, onMounted, ref, watch } from "vue";

import Zaehlart from "@/types/enum/Zaehlart";

interface Props {
  height: string;
}
defineProps<Props>();

const zaehlung = defineModel<ZaehlungDTO>("zaehlung", {
  required: true,
});
const isValid = defineModel<boolean>("isValid", {
  required: false,
});

const activeColor = "#D50000";
const passiveColor = "#9E9E9E";

const selectedKnotenarme = ref<Array<string>>([]);

const availableNodes = computed(() => {
  return zaehlung.value.knotenarme.map((arm) => `${arm.nummer}`);
});

onMounted(() => {
  resetForm();
});

watch(
  () => zaehlung.value.knotenarme,
  () => {
    resetForm();
  },
  { deep: true, immediate: true }
);

function isNodeAvailable(node: string): boolean {
  return availableNodes.value.includes(node);
}
/**
 * Wenn für die knotenarm im Array gefunden wurde, wird diese in der Grafik in der "activeColor" dargestellt,
 * ansonsten in der passiveColor.
 */
function calculateColor(knotenarm: string): string | undefined {
  let color = passiveColor;
  const gefilteterKnotenarm = selectedKnotenarme.value.filter(
    (k) => k === knotenarm
  )[0];
  if (gefilteterKnotenarm) {
    color = activeColor;
  }
  return color;
}

function activateNode(knotenarm: string) {
  if (!selectedKnotenarme.value.includes(knotenarm)) {
    selectedKnotenarme.value.push(knotenarm);
  } else {
    selectedKnotenarme.value.splice(
      selectedKnotenarme.value.indexOf(knotenarm),
      1
    );
  }
  validateSelection();
}

function activateOrDeactivateTotalNode(knotenarm: string) {
  if (!isNodeAvailable(knotenarm)) {
    // remove all
    return;
  }

  const endings = [];

  if (zaehlung.value.zaehlart === Zaehlart.QU) {
    endings.push("CL2R");
    endings.push("CR2L");
  }
  if (zaehlung.value.zaehlart === Zaehlart.FJS) {
    endings.push("LU");
    endings.push("LD");
    endings.push("RU");
    endings.push("RD");
  }

  const nodeStrings = endings.map((value) => knotenarm + value);

  let nothingRemoved = true;

  nodeStrings.forEach((nodeString) => {
    if (selectedKnotenarme.value.includes(nodeString)) {
      nothingRemoved = false;
      selectedKnotenarme.value.splice(
        selectedKnotenarme.value.indexOf(nodeString),
        1
      );
    }
  });

  if (nothingRemoved && isNodeAvailable(knotenarm)) {
    nodeStrings.forEach((value) => {
      activateNode(value);
    });
  }
  validateSelection();
}

function getCursorType(knotenarm: string) {
  if (isNodeAvailable(knotenarm)) {
    return `pointer`;
  } else {
    return "default";
  }
}

function getColorOfNode(knotenarm: string) {
  if (isNodeAvailable(knotenarm)) {
    return `#1565C0`;
  } else {
    return `#EEEEEE`;
  }
}

function resetForm() {
  selectedKnotenarme.value = [];
  validateSelection();
}

function validateSelection() {
  const selectedKnotenarmNummern = selectedKnotenarme.value.map(
    (knotenarm: string) => knotenarm.charAt(0)
  );
  // TODO richtige Validierug einbauen
  isValid.value =
    availableNodes.value.filter(
      (nodeNumber) => !selectedKnotenarmNummern.includes(nodeNumber)
    ).length === 0;
}
</script>
