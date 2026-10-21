#include <cstdio>
#include <cmath>

using namespace std;

double f(double x) {
    return exp(x) - 2.0 * x * x;
}

int main() {
    const double golden = 0.61803398874989481;
    int m;
    scanf("%d", &m);
    while (m--) {
        double a, b;
        scanf("%lf%lf", &a, &b);
        double farStep = (b - a) * golden;
        double nearStep = farStep * golden;
        double x1 = a + nearStep, x2 = a + farStep;
        double y1 = f(x1), y2 = f(x2);
        while (nearStep >= 0.4e-8) {
            farStep = nearStep;
            nearStep = farStep * golden;
            if (y1 < y2) {
                b = x2;
                x2 = x1;
                y2 = y1;
                x1 = a + nearStep;
                y1 = f(x1);
            } else {
                a = x1;
                x1 = x2;
                y1 = y2;
                x2 = a + farStep;
                y2 = f(x2);
            }
        }
        printf("%.9f %.9f %.9f %.9f %.9f %.9f\n", a, x1, x2, b, y1, y2);
    }
    return 0;
}
